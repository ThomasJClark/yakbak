var express    = require("express")
  , bodyParser = require("body-parser")
  , mongoose   = require("mongoose");

mongoose.connect(process.env.OPENSHIFT_MONGODB_DB_URL || "mongodb://localhost/test");

/**
 * A "Bak" is an anonymous post that can be voted on.
 */
var Bak = mongoose.model("Bak", mongoose.Schema({
  text:       {type: String,   required: true},
  userId:     {type: Number,   required: true},
  date:       {type: Date,     required: true},
  score:      {type: Number ,  default: 0},
  upvoters:   {type: [Number], default: []},
  downvoters: {type: [Number], default: []},
}));

var db = mongoose.connection;

db.on("error", function(err) {
  console.error("connection error:", err);
});

db.once("open", function() {
  var app = express();
  app.use(express.static("public"));
  app.use(bodyParser.json());

  /**
   * DELETE all of the Baks.  XXX: don't include this in production
   */
  app.delete("/baks", function(req, res) {
    Bak.remove({}, function(err) {
      if (err) return res.end(String(err));
      res.end();
      console.log("Deleted all Baks");
    })
  });

  /**
   * GET the (up to) 10 Baks with the highests current scores
   */
  app.get("/baks/top", function(req, res) {
    Bak.find().sort("-score").limit(10).exec(function(err, baks) {
      if (err) return res.end(String(err));
      res.json(baks);
      res.end();
    });
  });

  /**
   * GET the (up to) 10 most recent Baks
   */
  app.get("/baks/new", function(req, res) {
    Bak.find().sort("-date").limit(10).exec(function(err, baks) {
      if (err) return res.end(String(err));
      res.json(baks);
      res.end();
    });
  });

  /**
   * GET all of the Baks from a particular user
   */
  app.get("/baks/mine", function(req, res) {
    console.log(req.query.userId);
    Bak.find({userId: req.query.userId}).sort("-date").limit(10).exec(function(err, baks) {
      if (err) return res.end(String(err));
      res.json(baks);
      res.end();
    });
  });
  /**
   * POST a new Bak
   */
  app.post("/baks", function(req, res) {
    var bak = req.body;
    bak.date = new Date();

    new Bak(bak).save(function(err, bak) {
      if (err) return res.end(String(err));
      res.end();
      console.log("Posted new Bak", bak);
    });
  });

  /**
   * Increment or decrement the current score of a Bak
   */
  app.post("/vote", function(req, res) {
    var bakId = req.body.bakId;
    var userId = req.body.userId;
    var vote = req.body.vote;

    if (typeof bakId !== "string" || typeof userId !== "number" || typeof vote !== "number") {
      console.log("Need vote, Bak ID, and voter ID");
      return res.end();
    }

    Bak.findById(bakId, function(err, bak) {
      if (err) {
        console.error(err);
        return res.end(String(err));
      }


      // Each user can only upvote or downvote a Bak once.  If this user
      // already upvoted or downvoted this Bak and is doing the same action
      // again, short circuit.  If the user already did one action and is now
      // doing the opposite, undo it first.
      var downvoteIdx = bak.downvoters.indexOf(userId)
        , upvoteIdx = bak.upvoters.indexOf(userId);
      if (downvoteIdx != -1) {
        if (vote <= 0) {
          console.log("User already downvoted.");
          return res.end("User already downvoted.");
        } else {
          bak.downvoters.splice(downvoteIdx, 1);
          bak.score += 1;
        }
      } else if (upvoteIdx != -1) {
        if (vote > 0) {
          console.log("User already upvoted.");
          return res.end("User already upvoted.");
        } else {
          bak.upvoters.splice(upvoteIdx, 1);
          bak.score -= 1;
        }
      }

      // Either increment or decrement the Bak's score and record the user's
      // vote to prevent double voting.
      if (vote <= 0) {
        console.log("Downvoting");
        bak.score -= 1;
        bak.downvoters.push(userId);
      } else {
        console.log("Upvoting");
        bak.score += 1;
        bak.upvoters.push(userId);
      }

      console.log(bak);

      bak.save(function(err) {
        if (err) return res.end(String(err));
        res.end();
        console.log("Voted on a Bak", bak);
      });
    });

    res.end();
  });

  // Get the address and port based on the environment variables that
  // OpenShift gives us, or reasonable defaults if running locally.
  var addr = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
  var port = process.env.OPENSHIFT_NODEJS_PORT || 8080;

  // Start the app
  app.listen(port, addr, function() {
      console.log("Listening on %s:%d ...", addr, port);
  });
});

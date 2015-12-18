var yakbak = new YakBak();

var newBaks = document.getElementById("newBaks");
var topBaks = document.getElementById("topBaks");
var baksElement = document.getElementById("baks");
var bakText = document.getElementById("bakText");
var submitBak = document.getElementById("submitBak");

var reloadFunc = yakbak.topBaks;

newBaks.addEventListener("click", function() {
  reloadFunc = yakbak.newBaks;
  reload();
});

topBaks.addEventListener("click", function() {
  reloadFunc = yakbak.topBaks;
  reload();
});

myBaks.addEventListener("click", function() {
  reloadFunc = yakbak.myBaks.bind(yakbak);
  reload();
});

submitBak.addEventListener("click", function() {
  yakbak.postBak(bakText.value, reload);
  bakText.value = "";
});

function reload() {
  reloadFunc(function(baks) {
    baksElement.innerHTML = ""
    baks.forEach(function(bak) {
      var upvote = document.createElement("span");
      upvote.className = "mega-octicon octicon-arrow-up vote";
      upvote.addEventListener("click", function() { yakbak.vote(bak._id, +1, reload); });

      var downvote = document.createElement("span");
      downvote.className = "mega-octicon octicon-arrow-down vote";
      downvote.addEventListener("click", function() { yakbak.vote(bak._id, -1, reload); });

      var bakScore = document.createElement("span");
      bakScore.textContent = bak.score;

      var votingContainer = document.createElement("td");
      votingContainer.className = "voting-container";
      votingContainer.appendChild(upvote);
      votingContainer.appendChild(document.createElement("br"));
      votingContainer.appendChild(bakScore);
      votingContainer.appendChild(document.createElement("br"));
      votingContainer.appendChild(downvote);

      var bakText = document.createElement("td");
      bakText.textContent = bak.text;

      var bakElement = document.createElement("tr");
      bakElement.appendChild(votingContainer);
      bakElement.appendChild(bakText);

      // Highlight the upvote or downvote button to indicate if the user has
      // already upvoted or downvoted this post.
      var uid = yakbak.uid();
      if (bak.upvoters.indexOf(uid) != -1) {
        upvote.style.color = "#ff737f";
      } else if (bak.downvoters.indexOf(uid) != -1) {
        downvote.style.color = "#72a0fe";
      }

      baksElement.appendChild(bakElement);
    });
  })
}

reload();

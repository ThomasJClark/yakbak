/**
 * Utility methods for interacting with the YakBak REST API.
 */
function YakBak() {

  function uid() {
    /* This is stored in localStorage so the same ID will be used if someone
      accesses the site again later. */
    if (typeof(window.localStorage["uid"]) == "undefined") {
      window.localStorage["uid"] = Math.floor(Math.random() * 100000000);
    }

    return window.localStorage["uid"] | 0;
  }

  return {
    /**
     * Get a list of the most highly voted Baks
     */
    topBaks: function(callback) {
      var req = new XMLHttpRequest();
      req.open("GET", "/baks/top");
      req.onreadystatechange = function(evt) {
        if (req.readyState == XMLHttpRequest.DONE) {
          if (req.status == 200) {
            callback(JSON.parse(req.response));
          } else {
            console.error(req.response);
          }
        }
      };
      req.send();
    },

    /**
     * Get a list of the most recent Baks
     */
    newBaks: function(callback) {
      var req = new XMLHttpRequest();
      req.open("GET", "/baks/new");
      req.onreadystatechange = function(evt) {
        if (req.readyState == XMLHttpRequest.DONE) {
          if (req.status == 200) {
            callback(JSON.parse(req.response));
          } else {
            console.error(req.response);
          }
        }
      };
      req.send();
    },

    /**
     * Post a new Bak
     */
    postBak: function(text, callback) {
      var req = new XMLHttpRequest();
      req.open("POST", "/baks");
      req.onreadystatechange = function(evt) {
        if (req.readyState == XMLHttpRequest.DONE) {
          if (req.status == 200) {
            callback();
          } else {
            console.error(req.response);
          }
        }
      };
      req.setRequestHeader("Content-Type", "application/json");
      req.send(JSON.stringify({userId: uid(), text: text}));
    },

    /**
     * Vote on a Bak
     */
    vote: function(id, vote, callback) {
      var req = new XMLHttpRequest();
      req.open("POST", "/vote");
      req.onreadystatechange = function(evt) {
        if (req.readyState == XMLHttpRequest.DONE) {
          if (req.status == 200) {
            callback();
          } else {
            console.error(req.response);
          }
        }
      };
      req.setRequestHeader("Content-Type", "application/json");
      req.send(JSON.stringify({userId: uid(), bakId: id, vote: vote}));
    },
  }
}

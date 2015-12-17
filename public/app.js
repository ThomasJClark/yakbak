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

submitBak.addEventListener("click", function() {
  yakbak.postBak(bakText.value, reload);
  bakText.value = "";
});

function reload() {
  reloadFunc(function(baks) {
    baksElement.innerHTML = ""
    baks.forEach(function(bak) {
      var bakElement = document.createElement("tr");

      var bakScore = document.createElement("td");
      bakScore.textContent = bak.score;
      bakElement.appendChild(bakScore);

      var bakText = document.createElement("td");
      bakText.textContent = bak.text;
      bakElement.appendChild(bakText);

      var upvote = document.createElement("td");
      upvote.innerHTML = "<a href='#'>upvote</a>";
      upvote.addEventListener("click", function() { yakbak.vote(bak._id, +1, reload); });
      bakElement.appendChild(upvote);

      var downvote = document.createElement("td");
      downvote.innerHTML = "<a href='#'>downvote</a>";
      downvote.addEventListener("click", function() { yakbak.vote(bak._id, -1, reload); });
      bakElement.appendChild(downvote);

      baksElement.appendChild(bakElement);
    });
  })
}

reload();

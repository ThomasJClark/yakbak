var yakbak = new YakBak();

var baksElement = document.getElementById("baks");

function reload() {
  yakbak.topBaks(function(baks) {
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
      upvote.onclick = function() { yakbak.vote(bak._id, +1, reload); };
      bakElement.appendChild(upvote);

      var downvote = document.createElement("td");
      downvote.innerHTML = "<a href='#'>downvote</a>";
      downvote.onclick = function() { yakbak.vote(bak._id, -1, reload); };
      bakElement.appendChild(downvote);

      baksElement.appendChild(bakElement);
    });
  })
}

reload();

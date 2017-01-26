/* jshint esversion: 6 */
/* jshint expr: true */

// Handle 1-player vs 2-player
// Toggle game state on button click
    // Change button text
    // Swap .playerSelection with .playerScores
// Random number generator to see who goes first
// Loser goes first
// Keep track of whose turn it is
// Keep track of the letter to place in the square
// Build game logic for cpu AI
// Build function to check for win condition
// TODO: Make a custom alert box & function
// TODO: Make error alert(s)
// Make win/lose condition alert
// TODO: Add ability to set player names

// globals
// const xo = ["X", "O"];
var onePlayer = false;
var playersObj = {
    p1: { name: "Player One" },
    p2: { name: "Player Two" }
};
var firstTurn = 0; // (Player) 1 or 2
var curTurn = 1; // (Player) 1 or 2
var squaresArray = [];
var matchScores = [0,0];

function randomSquare() {
    // if using 2d squaresArray
        // var x = Math.floor(Math.random() * 3) + 1;
        // var y = Math.floor(Math.random() * 3) + 1;
        // return [x,y];
    // if using 1d squaresArray
    return Math.floor(Math.random() * 8);
}

function cpuMove() {
    // TODO: Build smarter cpu AI
    var emptySquares = squaresArray.filter(function(square){
        return square.firstChild.innerHTML === "";
    });

    if (emptySquares.length) {
        var idx = Math.floor(Math.random() * (emptySquares.length - 1));
        emptySquares[idx].firstChild.innerHTML = playersObj.p2.marker;
        setTimeout(checkWin, 50);
    } else {
        setTimeout(checkWin, 50);
    }

}

function matchOver(pNum) {
    var winner = "p" + pNum;
    // TODO: make custom alert
    alert(playersObj[winner].name + " has won the match!");
}

function updatePlayerText(curPlayer, lastPlayer) {
    if (lastPlayer) {
        document.getElementsByName(lastPlayer)[0].style = "";
    }

    document.getElementsByName(curPlayer)[0].style.color = "#fff";
}

function nextMove() {
    if (onePlayer && curTurn === 2) {
        updatePlayerText("p2Name", "p1Name");
        // Wait one second before moving
        window.setTimeout(cpuMove, 1000);
    } else {
        var lastTurn;
        curTurn === 1 ? lastTurn = 2 : lastTurn = 1;
        var lastPlayer = "p" + lastTurn + "Name";
        var curPlayer = "p" + curTurn + "Name";
        updatePlayerText(curPlayer, lastPlayer);
    }
}

function updatePlayerScores() {
    document.getElementsByClassName("p1Score")[0].innerHTML = matchScores[0];
    document.getElementsByClassName("p2Score")[0].innerHTML = matchScores[1];
}

function gameOver(win) {
    // flip firstTurn, increment matchScores
    if (curTurn === 1) {
        firstTurn = 2;
        if (win) {
            matchScores[0]++;
            alert(playersObj.p1.name + " has won the game!");
        }
    } else {
        firstTurn = 1;
        if (win) {
            matchScores[1]++;
            alert(playersObj.p2.name + " has won the game!");
        }
    }

    if (!win) {
        alert("It's a draw.");
    }

    updatePlayerScores();

    // Set player text to black
    document.getElementsByName("p1Name")[0].style.color = "#111";
    document.getElementsByName("p2Name")[0].style.color = "#111";

    // check to see if match has been won
    for (var i = 0; i < matchScores.length; i++) {
        if (matchScores[i] === 3) {
            setTimeout(matchOver(i + 1), 50);
            return;
        }
    }

    // if not, start a new game
    startGame();
}

function checkWin() {
    var win = false;
    var emptySquares = squaresArray.filter(function(square){
        return square.firstChild.innerHTML === "";
    });

    var winCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    for (let combo of winCombos) {
        var a = squaresArray[combo[0]].firstChild.innerHTML;
        var b = squaresArray[combo[1]].firstChild.innerHTML;
        var c = squaresArray[combo[2]].firstChild.innerHTML;

        if (a !== "" && a === b && b === c) {
            win = true;
        }
    }

    // If win, set firstTurn = losing player
    if (win) {
        gameOver(win);
    } else if (emptySquares.length === 0) {
        gameOver(win);
    } else {
        // If no win or draw, flip active player and trigger next move
        curTurn === 1
            ? curTurn = 2
            : curTurn = 1;
            nextMove();
    }
}

function clickSquare(square) {
    // Fill square with appropriate symbol
    if (square.target.className == "gameCellText") {
        // TODO: make a custom alert box & function
        alert("Please choose an empty square");
        return;
    }

    var curPlayer = "p" + curTurn;
    var cellText = square.target.firstChild;
    cellText.innerHTML = playersObj[curPlayer].marker;

    // Check for win condition
    setTimeout(checkWin, 50);
}

function goesFirst() {
    firstTurn = Math.round(Math.random()) + 1;
    return firstTurn;
}

function setMarkers(xPlayer, oPlayer) {
    xPlayer.marker = "X";
    oPlayer.marker = "O";
}

function startGame() {
    // If start of match, decide who goes first
    if (!firstTurn) {
        goesFirst();
    }

    var firstPlayer = "p" + firstTurn;
    alert(playersObj[firstPlayer].name + " goes first.");

    // Set curTurn = firstTurn
    curTurn = firstTurn;

    // Set player markers
    firstTurn === 1
        ? setMarkers(playersObj.p1, playersObj.p2)
        : setMarkers(playersObj.p2, playersObj.p1);



    // Change button text to "New Match"
    document.getElementsByName("newStartButton")[0].setAttribute("value","New Match");

    // Hide .playerSelection
    document.getElementsByClassName("playerSelection")[0].style.display = "none";

    // Unhide .playerScores
    document.getElementsByClassName("playerScores")[0].style.display = "block";

    // Update .playerScores
    updatePlayerScores();

    // Add event listeners to .gameCell
    // Empty gameCellTexts
    var squares = document.getElementsByClassName("gameCell");
    for (var e of squares) {
        e.firstChild.innerHTML = "";
        e.addEventListener("click", clickSquare);
    }

    // Fill squaresArray with gameCellTexts
    squaresArray = Array.from(document.getElementsByClassName("gameCell"));

    if (onePlayer && curTurn === 2) {
        updatePlayerText("p2Name");
        setTimeout(cpuMove, 1000);
    } else {
        curTurn === 1
            ? updatePlayerText("p1Name")
            : updatePlayerText("p2Name");
    }
}

function resetGame() {
    // TODO: Prompt for "are you sure?"

    // Change button text to "Start Match"
    document.getElementsByName("newStartButton")[0].setAttribute("value","Start Match");

    // Clear match scores
    matchScores = [0,0];

    // Clear squares array
    squaresArray = [];

    // Hide .playerScores
    document.getElementsByClassName("playerScores")[0].style.display = "none";

    // Unhide .playerSelection
    document.getElementsByClassName("playerSelection")[0].style.display = "block";

    // Clear all squares
    // Remove event listeners from .gameCell
    var squares = document.getElementsByClassName("gameCell");
    for (var e of squares) {
        e.firstChild.innerHTML = "";
        e.removeEventListener("click", clickSquare);
    }

    // Reset firstTurn
    firstTurn = 0;

    // Reset onePlayer
    onePlayer = false;

    // Reset Player Two name
    playersObj.p2.name = "Player Two";
    document.getElementsByName("p2Name")[0].setAttribute("value","Player Two");
}

function initGame(btn) {
    if (btn.target.value === "Start Match") {
        // Start match, if playerSelection checked
        var players = document.getElementsByName("players");
        for (var p of players) {
            if (p.checked) {
                if (p.value == 1) {
                    onePlayer = true;
                    playersObj.p2.name = "Computer";
                    document.getElementsByName("p2Name")[0].setAttribute("value","Computer");
                }
                startGame();
                return;
            }
        }
        // playerSelection not checked
        // TODO: change to use custom alert box
        alert("Choose number of players");
    } else if (btn.target.value === "New Match") {
        // Reset game
        resetGame();
    }
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var button = document.getElementsByName("newStartButton")[0];
    button.addEventListener("click", initGame);
  }
};

/* jshint esversion: 6 */

// Handle 1-player vs 2-player
// Toggle game state on button click
    // Change button text
    // Swap .playerSelection with .playerScores
// Random number generator to see who goes first
// TODO: Loser goes first
// TODO: Keep track of whose turn it is
// TODO: Keep track of the letter to place in the square
// TODO: Build game logic for cpu AI
// TODO: Build function to check for win condition
// TODO: Make a custom alert box & function
// TODO: Make error alert(s)
// TODO: Make win/lose condition alert
// TODO: Add ability to set player names

// globals
// const xo = ["X", "O"];
var onePlayer = false;
var p1 = { name: "Player One" }, p2 = { name: "Player Two" };
var firstTurn = 1; // (Player) 1 or 2
var curTurn = 1; // (Player) 1 or 2
var squaresArray = [];
var matchScores = [0,0];

function cpuMove() {
    // TODO: Build cpu AI

    // After move, check for win condition
    checkWin();
    return;
}

function checkWin() {
    // TODO: check for win condition
    // If win, set firstTurn = losing player
    // If no win, flip active player and trigger AI (if one player)
    cpuMove();
    return;
}

function clickSquare(square) {
    // Fill square with appropriate symbol
    if (square.target.className == "gameCellText") {
        // TODO: make a custom alert box & function
        alert("Please choose an empty square");
        return;
    }
    var cell = document.getElementsByClassName(square.target.className);
    var cellText = cell[0].getElementsByClassName("gameCellText");
    // TODO: add logic to determine "X" or "O"
    var curPlayer = "p" + curTurn;
    cellText[0].innerHTML = curPlayer.marker;

    // Check for win condition
    checkWin();
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
    if (matchScores.reduce(function(a,v) { return a + v; }) === 0) {
        goesFirst();
    }

    // Set curTurn = firstTurn
    curTurn = firstTurn;

    // Set player markers
    firstTurn === 1 ? setMarkers(p1, p2) : setMarkers(p2, p1);

    // Change button text to "New Match"
    document.getElementsByName("newStartButton")[0].setAttribute("value","New Match");

    // Hide .playerSelection
    document.getElementsByClassName("playerSelection")[0].style.display = "none";

    // Unhide .playerScores
    document.getElementsByClassName("playerScores")[0].style.display = "block";

    // Add event listeners to .gameCell
    var squares = document.getElementsByClassName("gameCell");
    for (var e of squares) {
        e.innerHTML = "";
        e.addEventListener("click", clickSquare);
    }
}

function resetGame() {
    // TODO: Prompt for "are you sure?"

    // Change button text to "Start Match"
    document.getElementsByName("newStartButton")[0].setAttribute("value","Start Match");

    // Clear match scores
    matchScores = [];

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
        e.innerHTML = "";
        e.removeEventListener("click", clickSquare);
    }
}

function initGame(btn) {
    if (btn.target.value === "Start Match") {
        // Start match, if playerSelection checked
        var players = document.getElementsByName("players");
        for (var p of players) {
            if (p.checked) {
                if (p.value === 1) {
                    onePlayer = true;
                    p2.name = "Computer";
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

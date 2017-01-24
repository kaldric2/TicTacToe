/* jshint esversion: 6 */

// TODO: Handle 1-player vs 2-player
// TODO: Toggle game state on button click
    // TODO: Change button text
    // TODO: Swap .playerSelection with .playerScores
// TODO: Random number generator to see who goes first
// TODO: Loser goes first
// TODO: Keep track of whose turn it is
// TODO: Keep track of the letter to place in the square
// TODO: Build game logic for cpu AI
// TODO: Build function to check for win condition
// TODO: Make a custom alert box & function
// TODO: Make error alert(s)
// TODO: Make win/lose condition alert

// globals
const xo = ["X", "O"];
var firstTurn = 1; // (Player) 1 or 2
var curTurn = 0; // Index to xo, with firstTurn = 0
var squareArray = [];

function cpuMove() {
    // TODO: Build cpu AI

    // After move, check for win condition
    checkWin();
    return;
}

function checkWin() {
    // TODO: check for win condition
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
    cellText[0].innerHTML = "X";

    // Check for win condition
    checkWin();
}

function startGame(players) {
    // Handle one player vs two players
    // Change button text to "New Match"
    // Hide .platerSelection
    // Unhide .playerScores

    // Add event listeners to .gameCell
    var squares = document.getElementsByClassName("gameCell");
    for (var e of squares) {
        e.addEventListener("click", clickSquare);
    }

    return;
}

function resetGame() {
    // Prompt for "are you sure?"
    // Change button text to "Start Match"
    // Clear squares array
    // Hide .playerScores
    // Unhide .platerSelection

    // Clear all squares
    // Remove event listeners from .gameCell
    var squares = document.getElementsByClassName("gameCell");
    for (var e of squares) {
        e.innerHTML = "";
        e.removeEventListener("click", clickSquare);
    }
    return;
}

function initGame(btn) {
    // Handle button click: start game or reset game or prompt for number of players

    console.log(btn.target.value);
    if (btn.target.value === "Start Match") {
        var players = document.getElementsByName("players");
        for (var p of players) {
            if (p.checked) {
                startGame(p.value);
                return;
            }
        }
    }
    // TODO: change to use custom alert box
    return alert("Choose number of players");
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var button = document.getElementsByName("newStartButton")[0];
    button.addEventListener("click", initGame);
  }
};

// globals
var onePlayer = false;
var playersObj = {
    p1: { name: "Player One" },
    p2: { name: "Player Two" }
};
var firstTurn = 0; // (Player) 1 or 2
var curTurn = 1; // (Player) 1 or 2
var squaresArray = [];
var matchScores = [0,0];

var callback = "";

function openAlert(message, btnText, alertCallback) {
    var alertBoxMessage = document.getElementsByClassName("alertMessage")[0];
    alertBoxMessage.innerHTML = message;

    var alertBoxClose = document.getElementsByClassName("alertClose")[0];
    alertBoxClose.innerHTML = btnText;

    var alertBoxModal = document.getElementsByClassName("alertModal")[0];
    alertBoxModal.style.opacity = "1";
    alertBoxModal.style.visibility = "visible";

    if (alertCallback) {
        callback = alertCallback;
    }
}

function closeAlert() {
    var alertBoxModal = document.getElementsByClassName("alertModal")[0];
    alertBoxModal.style.opacity = "0";
    alertBoxModal.style.visibility = "hidden";

    var alertCallback = callback;
    callback = 0;
    if (alertCallback) {
        alertCallback();
    }
}

function randomSquare() {
    return Math.floor(Math.random() * 8);
}

function cpuMove() {
    var blockWin = assessBoard(2);
    var emptySquares = squaresArray.filter(function(square){
        return square.firstChild.innerHTML === "";
    });

    if (blockWin) {
        blockWin.firstChild.innerHTML = playersObj.p2.marker;
        setTimeout(checkWin, 50);
    } else if (emptySquares.length) {
        var idx = Math.floor(Math.random() * (emptySquares.length - 1));
        emptySquares[idx].firstChild.innerHTML = playersObj.p2.marker;
        setTimeout(checkWin, 50);
    } else {
        setTimeout(checkWin, 50);
    }

}

function matchOver(pNum) {
    var winner = "p" + pNum;
    openAlert(playersObj[winner].name + " has won the match!", "Yay!");
}

function updatePlayerText(curPlayer, lastPlayer) {
    if (lastPlayer) {
        document.getElementsByName(lastPlayer)[0].style.color = "";
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
    var alertCallback = function() {
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
    };


    // flip firstTurn, increment matchScores
    if (curTurn === 1) {
        firstTurn = 2;
        if (win) {
            matchScores[0]++;
            openAlert(playersObj.p1.name + " has won the game!", "Nice!", alertCallback);
        }
    } else {
        firstTurn = 1;
        if (win) {
            matchScores[1]++;
            openAlert(playersObj.p2.name + " has won the game!", "Nice!", alertCallback);
        }
    }

    if (!win) {
        openAlert("It's a draw.", "Meh.", alertCallback);
    }
}

function assessBoard(num) {
    var winCombos = [
        [0,1,2],[3,4,5],[6,7,8],
        [0,3,6],[1,4,7],[2,5,8],
        [0,4,8],[2,4,6]
    ];

    var twoArrays = [];

    for (let combo of winCombos) {
        var a = squaresArray[combo[0]].firstChild.innerHTML;
        var b = squaresArray[combo[1]].firstChild.innerHTML;
        var c = squaresArray[combo[2]].firstChild.innerHTML;

        if (num === 3) {
            if (a !== "" && a === b && b === c) {
                return true;
            }
        }

        if (num === 2) {
            var valsArr = [a,b,c];
            var xS = valsArr.reduce((acc, val) => { return acc + (val === "X" ? 1 : 0) }, 0);
            var oS = valsArr.reduce((acc, val) => { return acc + (val === "O" ? 1 : 0) }, 0);
            var blanks = valsArr.reduce((acc, val) => { return acc + (val === "" ? 1 : 0) }, 0);

            if (blanks === 1 && (xS === 2 || oS === 2)) {
                var xO = xS === 2? "X" : "O";
                twoArrays.push([valsArr, combo, xO]);
            }
        }
    }

    // Go for the win first
    var cpuWin = twoArrays.filter((val) => { if (val[2] === playersObj.p2.marker) return val });
    if (cpuWin.length > 0) {
        var blankIdx = cpuWin[0][0].map((val, idx) => { if (val === "") return cpuWin[0][1][idx] });
        blankIdx = blankIdx.filter((val) => { if (val != undefined) return val })[0];
        return squaresArray[blankIdx];
    } else if (twoArrays.length > 0) {
        // Else, block the opponent's victory
        var blankIdx = twoArrays[0][0].map((val, idx) => { if (val === "") return twoArrays[0][1][idx] });
        blankIdx = blankIdx.filter((val) => { if (val != undefined) return val })[0];
        return squaresArray[blankIdx];
    }


}

function checkWin() {
    var win = assessBoard(3);

    var emptySquares = squaresArray.filter(function(square){
        return square.firstChild.innerHTML === "";
    });

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
        openAlert("Please choose an empty square", "Ok");
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
    for (var i = 0; i < squares.length; i++) {
        squares[i].firstChild.innerHTML = "";
        squares[i].addEventListener("click", clickSquare);
    }

    // Fill squaresArray with gameCellTexts
    squaresArray = Array.from(document.getElementsByClassName("gameCell"));

    var alertCallback = function(){
        if (onePlayer && curTurn === 2) {
            updatePlayerText("p2Name");
            setTimeout(cpuMove, 1000);
        } else {
            curTurn === 1
                ? updatePlayerText("p1Name")
                : updatePlayerText("p2Name");
        }
    };

    var firstPlayer = "p" + firstTurn;
    openAlert(playersObj[firstPlayer].name + " goes first.", "Let's go!", alertCallback);
}

function resetGame() {
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
    for (var i = 0; i < squares.length; i++) {
        squares[i].firstChild.innerHTML = "";
        squares[i].removeEventListener("click", clickSquare);
    }

    // Reset firstTurn
    firstTurn = 0;

    // Reset onePlayer
    onePlayer = false;

    // Reset Player Two name
    playersObj.p2.name = "Player Two";
    document.getElementsByName("p2Name")[0].setAttribute("value","Player Two");

    // Reset player name colors
    document.getElementsByName("p1Name")[0].style.color = "";
    document.getElementsByName("p2Name")[0].style.color = "";
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
                openAlert("It's best three out of five.<br>Good luck!", "Thanks!", startGame);
                return;
            }
        }
        // playerSelection not checked
        openAlert("Choose number of players", "Ok");
    } else if (btn.target.value === "New Match") {
        // Reset game
        resetGame();
    }
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var button = document.getElementsByName("newStartButton")[0];
    button.addEventListener("click", initGame);

    var alertBoxClose = document.getElementsByClassName("alertClose")[0];
    alertBoxClose.addEventListener("click", closeAlert);
  }
};

function clickSquare(e) {
    console.log(e);
    if (e.target.className == "gameCellText") {
        alert("Please choose an empty square");
        return;
    }
    var cell = document.getElementsByClassName(e.target.className);
    console.log(cell);
    var cellText = cell[0].getElementsByClassName("gameCellText");
    console.log(cellText[0]);
    cellText[0].innerHTML = "X";
}

document.onreadystatechange = function () {
  if (document.readyState === "complete") {
    var elements = document.getElementsByClassName("gameCell");
    for (e of elements) {
        e.addEventListener("click", clickSquare);
    }
    // initApplication();
  }
};

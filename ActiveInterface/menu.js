
function initMenu(){
    var text, parser, xmlDoc;

    var reader = new FileReader();
    loadDoc;
    // readTextFile("file:///C:/ActiveFloorDeploy/Content/BCA-ActiveFloor/Release.blast");

    // var text, praser, xmlDoc

    var gameArr = ["Pong","Snake","Dodgeball", "Slide Puzzle", "Memory", "Tetris", "TicTacToe"];
    ctx.fillStyle = 'black';
    ctx.font = '24px Courier';
    ctx.strokeStyle = 'black';
    var maxItemsPerPage = 5;
    var menuItemHeight = 38;


    for(var i = 0; i / menuItemHeight < maxItemsPerPage; i += menuItemHeight){
        console.log(i);
        ctx.fillText(gameArr[i / menuItemHeight], ((canvasWidth / 2) - (ctx.measureText(gameArr[i / menuItemHeight]).width / 2)), i);
    }

}

function loadDoc() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            alert(this.responseText);
        }
    };
    xhttp.open("GET", "C:xampp/htdocs/Release.blast", true);
    xhttp.send();
}




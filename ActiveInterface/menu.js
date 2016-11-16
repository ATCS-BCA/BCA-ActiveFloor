var gameArr, maxItemsPerPage, menuItemHeight, text, parser, xmlDoc, reader;

function initMenu(){
    console.log("In initMenu()");
    
    reader = new FileReader();
    loadDoc();
    // readTextFile("file:///C:/ActiveFloorDeploy/Content/BCA-ActiveFloor/Release.blast");

    // var text, praser, xmlDoc
    gameArr = ["Pong","Snake","Dodgeball", "Slide Puzzle", "Memory", "Tetris", "TicTacToe"];
    
    ctx.fillStyle = 'black';
    ctx.font = '24px Courier';
    ctx.strokeStyle = 'black';
    
    maxItemsPerPage = 5;
    menuItemHeight = 38;

}

function drawMenu(){
    
    $("floorCanvas").addClass("menu");
    /*for(var i = 0; i / menuItemHeight < maxItemsPerPage; i += menuItemHeight){
        ctx.fillText(gameArr[i / menuItemHeight], ((canvas.width / 2) - (ctx.measureText(gameArr[i / menuItemHeight]).width / 2)), i);
    }*/
}

function loadDoc() {
    console.log("loadDoc() is being called!")
    var xhr = new XMLHttpRequest();


    xhr.open("GET", "http://127.0.0.1/release.blast", true);
    xhr.onload = function (e) {
        if (xhr.readyState === 4) {
            console.log("buddy");
            if (xhr.status === 200) {
                console.log(xhr.responseText);
            } else {
                console.error(xhr.statusText);
            }
        }
    };
    xhr.onerror = function (e) {
        console.error(xhr.statusText);
    }
    xhr.send(null);
}  




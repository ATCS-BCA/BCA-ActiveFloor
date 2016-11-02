

function initMenu(){
    var text, parser, xmlDoc;

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

    /*
    text = new XMLSerializer().serializeToString("../../Release.blast");
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(txt, "text/xml");

    console.log(xmlDoc.getElementsByTagName("AppModes"));
    */
}
}
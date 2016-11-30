var gameArr, maxItemsPerPage, menuItemHeight, text, parser, xmlDoc, reader, currGame;
var gameNum = 0;
var gameSelected = false;
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var ctx;
var menuPage = false;
var refreshTime = 17;
var startBtn;
var firstTime = true;
var sensorDiv = 8;
var text, parser, xmlDoc;

function initMenu(){
    console.log("In initMenu()");
    
    reader = new FileReader();

    // readTextFile("file:///C:/ActiveFloorDeploy/Content/BCA-ActiveFloor/Release.blast");

    // var text, praser, xmlDoc
    
    gameArr = ["Pong","Snake","Dodgeball", "Slide Puzzle", "Memory", "Tetris", "TicTacToe"];
   
    ctx.fillStyle = 'black';
    ctx.font = '24px Courier';
    ctx.strokeStyle = 'black';
    
    maxItemsPerPage = 5;
    menuItemHeight = 38;
    /*
    setLinks();

    console.log("#22333");
    for (var key in links) {
        console.log("hm");
        if (links.hasOwnProperty in key) {
            console.log(key + ' ' + links[key]);
        }
    }
    */
}

function drawMenu(dataArr){
     
    $("#floorCanvas").addClass("menu");
    ctx.strokeRect(playBtn.bx, playBtn.by, playBtn.bw, playBtn.bh);
    ctx.fillText(playBtn.text,playBtn.x,playBtn.y);
    currGame = gameArr[gameNum];
    ctx.fillText(currGame, canvas.width / 3, canvas.height / 4 );
    //ctx.fillText("Select Game", canvas.width - ctx.measureText("Select Game").width - 20, canvas.height / 2)
    //ctx.fillText("Using Arrows!", canvas.width - ctx.measureText("Select Game").width - 20, canvas.height / 2 + 30)
    console.log("after drawing")
    while(!gameSelected){
        for(var i = 0; i < dataArr.length; i++){
            for(var j = 0; j < dataArr[i].length;j++){
                if(dataArr[i][j] === "*"){
                    if(i > Math.floor(leftArrow.y/sensorDiv) && i < Math.floor( (leftArrow.y + leftArrow.h) / sensorDiv)){
                        if(j > Math.floor(leftArrow.x / sensorDiv) && j < Math.floor( ( leftArrow.x + leftArrow.w) / sensorDiv ) ){
                            if(gameNum > 0){
                                gameNum--;
                                console.log("left arrow clicked");
                            }
                        }
                    }
                    else if(i > Math.floor(rightArrow.y/sensorDiv) && i < Math.floor( (rightArrow.y + rightArrow.h) / sensorDiv)){
                        if(j > Math.floor(leftArrow.x / sensorDiv) && j < Math.floor( ( rightArrow.x + rightArrow.w) / sensorDiv ) ){
                            if(gameNum < gameArr.length)
                                gameNum++;
                        }
                    }

                }
            }
        }
    }
    
    
}




 
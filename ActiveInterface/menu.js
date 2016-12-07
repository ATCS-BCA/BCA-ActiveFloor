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
var dataArr;
var btnClicked = false;

function sleep(delay) {
    var start = new Date().getTime();
    while (new Date().getTime() < start + delay);
}

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
    
    var links = setLinks();

    console.log("#22333");
    console.log(links);
    for (var key in links) {
        // if (links.hasOwnProperty in key) {
            console.log(key + ' ' + links[key]);
        // }
    }
    
}

function drawMenu(dataArr){
    //console.log(links["Dodgeball"]);
    $("#floorCanvas").addClass("menu");
    ctx.fillText(playBtn.text,playBtn.x,playBtn.y);
    ctx.strokeRect(playBtn.bx, playBtn.by, playBtn.bw, playBtn.bh);
    console.log(gameNum);
    currGame = gameArr[gameNum];
    ctx.fillText(currGame, canvas.width / 3, canvas.height / 4 );
    
    for(var i = 0; i < dataArr.length; i++){
        for(var j = 0; j < dataArr[i].length;j++){
            if(!btnClicked){
                if(dataArr[i][j] === "*"){
                    
                    //if(i > Math.floor(leftArrow.y/sensorDiv) && i < Math.floor( (leftArrow.y + leftArrow.h) / sensorDiv)){
                    if(i > 1 && i < 5){
                        //if(j > Math.floor(leftArrow.x / sensorDiv) && j < Math.floor( ( leftArrow.x + leftArrow.w) / sensorDiv ) ){
                        if(j > 1 && j < 5 ){
                            if(gameNum > 0){
                                gameNum--;
                                btnClicked = true;
                                ctx.clearRect(0,0,canvas.width,canvas.height/2);
                            }
                             
                        }
                    }
                    //else if(i > Math.floor(rightArrow.y/sensorDiv) && i < Math.floor( (rightArrow.y + rightArrow.h) / sensorDiv)){
                    if(i > 1 && i < 5){
                        //if(j > Math.floor(leftArrow.x / sensorDiv) && j < Math.floor( ( rightArrow.x + rightArrow.w) / sensorDiv ) ){
                        if(j > 19 && j < 23 ){
                            if(gameNum < gameArr.length){
                                gameNum++;
                                btnClicked = true;
                                ctx.clearRect(0,0,canvas.width,canvas.height/2);
                            }  
                            //drawMenu(dataArr)
                        }
                    }     
                }
            }
        }
    }
    sleep(500);
    if(btnClicked){
        btnClicked = false;
    }
    
    //$("#floorCanvas").removeClass("menu");
}
    





 
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
var canvasWidth;
var canvasHeight;

function initStartPage(){
    //var canvas = document.getElementById('floorCanvas');

    ctx.fillStyle = 'black';
    ctx.font = '24px Courier';
    ctx.strokeStyle = 'black';
    console.log(startBtn.by);
    ctx.fillText('Welcome to', ((canvasWidth / 2) - (ctx.measureText('Welcome to').width / 2)), 50);
    ctx.fillText('ATCS', ((canvasWidth / 2) - (ctx.measureText('ATCS').width / 2)), 80);


    ctx.fillText(startBtn.text,startBtn.x,startBtn.y);
    
    ctx.strokeRect(startBtn.bx, startBtn.by, startBtn.bw, startBtn.bh)
    
}

function drawBoard(dataArr){
    
    if(firstTime){
        setObjects();
        initCanvas()

        firstTime = false;
        initStartPage();

    }
    if(!menuPage){
        checkForStart(dataArr);
    }
    
}

function checkForStart(dataArr){
    
    for(var i = 0; i < dataArr.length; i++){
        for(var j = 0; j < dataArr[i].length;j++){
            if(dataArr[i][j] === "*"){
                console.log(startBtn);
                if(i > Math.floor(startBtn.by/sensorDiv) && i < Math.floor( (startBtn.by + startBtn.bh) / sensorDiv)){
                    if(j > Math.floor(startBtn.bx / sensorDiv) && j < Math.floor( ( startBtn.bx + startBtn.bw) / sensorDiv ) ){
                        menuPage = true;
                        window.location = "menu.html";
                        initMenu();
                    }
                }

            }
        }
    }
}






function setObjects() {
    startBtn = {
        x: canvasWidth/3 - 6,
        y: ( (canvasHeight) - (canvasHeight/3)) + 27,
        w: canvasWidth / 3- 10,
        h: canvasHeight/6 + 10,
        bx: (canvasWidth / 3) - 10,
        by: (canvasHeight) - (canvasHeight/3) + 10,
        bw: canvasWidth / 3,
        bh: canvasHeight / 8,
        text: 'Step'
    };
    /*
    pong = {
        location: "/..pong/pong.js",
        x:0,
        y:0

    }

    */
}

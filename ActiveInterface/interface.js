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
//OBJECTS


window.onload = function() {
    
    /*var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
    */
<<<<<<< HEAD
        
=======


>>>>>>> f13fb689ae2d961e629e86169eaa84e8c563479c
    var framesPerSecond = 60;

    canvas = document.getElementById('floorCanvas');
    canvas.width = 192;
    canvas.height = 192;
    ctx = canvas.getContext('2d');
    startCanvas();

<<<<<<< HEAD
        // canvas.width = ledsX;
        // canvas.height = ledsY;
        canvas.width = 192;
        canvas.height = 192;
        ctx = canvas.getContext('2d');
        
        setObjects();
        startCanvas();

        firstTime = false;
    }
=======
    

>>>>>>> f13fb689ae2d961e629e86169eaa84e8c563479c
    /*
    if (menuPage) {
        canvas.width = 192;
        canvas.height = 192;
        runMenuPage();
        setObjects();

        menuPage = false;

    }
    */
};

function refreshXML() {
    'use strict';
    $.get('http://127.0.0.1:8080/', function (data) {
        dataHolderArray = [];
                
        $(data).find('BLFloor').each(function () {
            $item = $(this);
            ledsX = $item.attr('ledsX');
            ledsY = $item.attr('ledsY');
            sensorsX = $item.attr('sensorsX');
            sensorsY = $item.attr('sensorsY');
            ledPerSensorX = (ledsX / sensorsX);
            ledPerSensorY = (ledsY / sensorsY);
            xCenter = ledPerSensorX / 2;
            yCenter = ledPerSensorY / 2;

        });
        
        $(data).find('Row').each(function () {
            var $row, rowNum, rowVal, n;
            $row = $(this);
            rowNum = $row.attr('rownum');
            rowVal = $row.attr('values');
            n = rowVal.split(charDivide).join('');

            dataHolderArray.push(n);
        });
        canvasWidth = ledsX;
        canvasHeight = ledsY;
        setObjects();

        if (menuPage){

            runMenuPage(dataHolderArray);
        }
        else{
            console.log("checking for start")
            checkForStart(dataHolderArray);
        }
        
        drawBoard(dataHolderArray);
    });
}


    


function startCanvas(){
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

function initBoard(){
    console.log("initing")
}

function drawBoard(dataArr){
    //
}

function checkForStart(dataArr){
    // console.log(startBtn.text + ":" + startBtn.x)
    /*ctx.clearRect(0, 0, canvas.width, canvas.height);*/
    
    for(var i = 0; i < dataArr.length; i++){
        for(var j = 0; j < dataArr[i].length;j++){
            if(dataArr[i][j] === "*"){
                console.log(startBtn);
                if(i > Math.floor(startBtn.by/sensorDiv) && i < Math.floor( (startBtn.by + startBtn.bh) / sensorDiv)){
                    if(j > Math.floor(startBtn.bx / sensorDiv) && j < Math.floor( ( startBtn.bx + startBtn.bw) / sensorDiv ) ){
                        menuPage = true;
                        window.location = "menu.html";
                    }
                }

            }
        }
    }
}

function runMenuPage(){
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

function displayUrls(dataArr) {
    for (var i = 0; i < dataArr.length; i++) {
        for (var j = 0; j  < dataArr[i].length; j++) {
              
        }
    }
}

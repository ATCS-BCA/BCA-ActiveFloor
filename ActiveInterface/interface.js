var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var menuPage = false;
var refreshTime = 17;
var startBtn;

var canvas = document.createElement('canvas');
var canvasContext = canvas.getContext('2d');

window.onload = function(){

    var framesPerSecond = 60;
    canvas.width = 192;
    canvas.height = 192;

    setObjects();

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

        if (!menuPage){
            checkForStart(dataHolderArray);
        }
        drawBoard(dataHolderArray);
    });
}

function initBoard(){
    console.log("initing")
}

function drawBoard(dataArr){
    console.log("drawing")
}

function checkForStart(dataArr){
    canvasContext.clearRect(0, 0, canvas.width, canvas.height);
    canvasContext.fillStyle = 'black';

    canvasContext.strokeStyle = 'black';
    canvasContext.stokeRect(startBtn.bx, startBtn.by, startBtn.bw, startBtn.bh)


    for(var i = 0; i < dataArr.length; i++){
        for(var j = 0; j < dataArr[i].length;j++){
            if(dataArr[i][j] === "*"){
                if(i > 16 && (j > 2 && j < 22)){
                    console.log("selected");
                    menuPage = true;
                    window.location = "menu.html";
                }
            }
        }
    }
}

function setObjects() {
    startBtn = {
        x: (canvas.width*2 / 3) - (context2D.measureText('Step to Begin').width / 2),
        y: 160,
        w: context2D.measureText('Step to Begin').width,
        h: 15,
        bx: (canvas.width / 2) - (context2D.measureText('Step To Begin').width / 2) - 20,
        by: 160 - 15,
        bw: context2D.measureText('Step To Begin').width + 40,
        bh: 15 + 5
    }
}

function displayUrls(dataArr) {
    for (var i = 0; i < dataArr.length; i++) {
        for (var j = 0; j  < dataArr[i].length; j++) {
              
        }
    }
}
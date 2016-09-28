var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, ctx;
var menuPage = false;
var refreshTime = 17;
var startBtn;
var firstTime = true;

window.onload = function(){

    
    /*var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
    */
    canvas = document.createElement('canvas')
    ctx = canvas.getContext('2d');
    
    var framesPerSecond = 60;

    if (firstTime){
        canvas.width = 192;
        canvas.height = 192;
        startCanvas();
        setObjects();

        firstTime = false;
    }
    
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
        else{
            runMenuPage(dataHolderArray);
        }
        
        drawBoard(dataHolderArray);
    });
}


    


function startCanvas(){
    //var canvas = document.getElementById('floorCanvas');
    
}

function initBoard(){
    console.log("initing")
}

function drawBoard(dataArr){
    console.log("drawing")
}

function checkForStart(dataArr){
    // console.log(startBtn.text + ":" + startBtn.x)
    /*ctx.clearRect(0, 0, canvas.width, canvas.height);*/
    ctx.fillStyle = 'black';
    ctx.font = '24px sans-serif';
    ctx.fillText(startBtn.text,startBtn.x,startBtn.y);
    ctx.strokeStyle = 'black';
    ctx.strokeRect(startBtn.bx, startBtn.by, startBtn.bw, startBtn.bh)


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

function runMenuPage(){
}
function setObjects() {
    startBtn = {
        x: 80,
        y: 160,
        w: 70,
        h: 15,
        bx: (canvas.width / 2) - 20,
        by: 160 - 15,
        bw: 40,
        bh: 15 + 5,
        text: 'Step to Begin'
    }
}

function displayUrls(dataArr) {
    for (var i = 0; i < dataArr.length; i++) {
        for (var j = 0; j  < dataArr[i].length; j++) {
              
        }
    }
}

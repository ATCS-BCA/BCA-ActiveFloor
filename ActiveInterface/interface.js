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
var sensorDiv = 8;
var text, parser, xmlDoc;

window.onload = function() {
    
    /*var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);
    */
    


    
    var framesPerSecond = 60;

    if (firstTime){
        canvas = document.getElementById('floorCanvas')

        // canvas.width = ledsX;
        // canvas.height = ledsY;
        canvas.width = 192;

        ctx = canvas.getContext('2d');
        
        setObjects();
        startCanvas();

        

        firstTime = false;
    }
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
    ctx.fillStyle = 'white';
    ctx.font = '24px Courier';
    ctx.strokeStyle = 'black';

    ctx.fillText('Welcome to', ((canvas.width / 2) - (ctx.measureText('Welcome to').width / 2)), 50);
    ctx.fillText('ATCS', ((canvas.width / 2) - (ctx.measureText('ATCS').width / 2)), 80);


    ctx.fillText(startBtn.text,startBtn.x,startBtn.y);
    
    ctx.strokeRect(startBtn.bx, startBtn.by, startBtn.bw, startBtn.bh)
    
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
    
    for(var i = 0; i < dataArr.length; i++){
        for(var j = 0; j < dataArr[i].length;j++){
            if(dataArr[i][j] === "*"){      
                if(i > Math.floor(startBtn.bx/sensorDiv) && i < Math.floor( (startBtn.bx + startBtn.bw) / sensorDiv)){
                    console.log("After: " + startBtn.bx);
                    if(j > Math.floor(startBtn.by / sensorDiv) && j < Math.floor( ( startBtn.by + startBtn.bh) / sensorDiv ) ){
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

    text = new XMLSerializer().serializeToString("../../Release.blast");
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(txt, "text/xml");

    console.log(xmlDoc.getElementsByTagName("test"));
}
function setObjects() {
    startBtn = {
        x: canvas.width/3 - 6,
        y: ((canvas.height) - (canvas.height/3)) + 27,
        w: canvas.width / 3- 10,
        h: canvas.height/6 + 15,
        bx: (canvas.width / 3) - 10,
        by: (canvas.height) - (canvas.height/3) + 10,
        bw: canvas.width / 3,
        bh: canvas.height / 8 + 5,
        text: 'Step'
    }
}

function displayUrls(dataArr) {
    for (var i = 0; i < dataArr.length; i++) {
        for (var j = 0; j  < dataArr[i].length; j++) {
              
        }
    }
}
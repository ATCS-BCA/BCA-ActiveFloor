var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var firstTime = true;
var refreshTime = 80;
var noTouch = true;

function initCanvas(arr) {
    'use strict';

    if (firstTime){
       startCanvas();
       setObjects();

       firstTime = false;
       menu(); 
    }
    
    var i, tempRow, p, srchStr, tempX, tempY;
    
    if (screen == 0){//menu
        for (i = 0; i < arr.length; i += 1) {
            tempRow = arr[i];
            
            for (p = 0; p < tempRow.length; p += 1) {
                srchStr = tempRow.substring(p, p + 1);
                if (srchStr === charSearch) {
                    tempX = p * ledPerSensorX;
                    tempY = i * ledPerSensorY;
                    if(startBtn.bx <= tempX && tempX <= startBtn.bx + startBtn.bw && startBtn.by <= tempY 
                        && tempY <= startBtn.by + startBtn.bh) {
                        game = true;
                        start();
                    }
                }
            }
        }
    } else if (screen == 1){//game
        for (i = 0; i < arr.length; i += 1) {
            tempRow = arr[i];
            
            for (p = 0; p < tempRow.length; p += 1) {
                srchStr = tempRow.substring(p, p + 1);
                if (srchStr === charSearch) {
                    tempX = p * ledPerSensorX;
                    tempY = i * ledPerSensorY;
                    checkPlayerHit(tempX, tempY);
                    noTouch = false;
                }
            }
        }
        if (noTouch)
            active = false;
    } else if (screen == 3){//game over
         for (i = 0; i < arr.length; i += 1) {
            tempRow = arr[i];
            
            for (p = 0; p < tempRow.length; p += 1) {
                srchStr = tempRow.substring(p, p + 1);
                if (srchStr === charSearch) {
                    tempX = p * ledPerSensorX;
                    tempY = i * ledPerSensorY;
                    if(restartBtn.bx <= tempX && tempX <= restartBtn.bx + restartBtn.bw && restartBtn.by <= tempY 
                        && tempY <= restartBtn.by + restartBtn.bh) {
                        menu();
                    }
                }
            }
        }
    }
    
}

function setObjects(){
    startBtn = {
        x: (canvas.width / 2) - (context2D.measureText('Start').width / 2),
        y: 160,
        w: context2D.measureText('Start').width,
        h: 15,
        bx: (canvas.width / 2) - (context2D.measureText('Start').width / 2) - 20,
        by: 160 - 15,
        bw: context2D.measureText('Start').width + 40,
        bh: 15 + 5
    };
    restartBtn = {
        x: (canvas.width / 2) - (context2D.measureText('Restart').width / 2),
        y: startBtn.y - 25,
        w: context2D.measureText('Restart').width, 
        h: startBtn.w,
        bx: (canvas.width / 2) - (context2D.measureText('Restart').width / 2) - 20,
        by: startBtn.by - 25,
        bw: context2D.measureText('Restart').width + 40,
        bh: startBtn.bh
    };

    spawner = {
        x: canvas.width/2,
        y: canvas.height/2,
        nextX: canvas.width/2,
        nextY: canvas.height/2,
        direction: 0,
        dx: 0,
        dy: 0,
        speed: 0,
        radius: size + 5,
        mass: 100000000
    };
}

function startCanvas(){
    canvas = document.getElementById('floorCanvas');
    canvas.width = ledsX;
    canvas.height = ledsY;
    context2D = canvas.getContext('2d');
}

function refreshXML() {
    'use strict';
    // change IP address to match ActiveFloor server address
    $.get('http://10.31.34.221:8080/', function (data) {
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
            
        initCanvas(dataHolderArray);
    });
}

$(document).ready(function () {
    'use strict';
    startRefresh();

    sendSemaphore(function() {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");
        
    });    
});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {refreshXML(); }, refreshTime);
}
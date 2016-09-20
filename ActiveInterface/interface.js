window.onload = function(){ 
    canvas = document.getElementById('floorCanvas');
    canvasContext = canvas.getContext("2d");
    
    var framesPerSecond = 60;
    initBoard();
    
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
        moveStart = 0;
        drawBoard(dataHolderArray);
    });
}

function initBoard(){
    canvasContext.font = '25px sans-serif';
    canvasContext.fillText("Welcome To BCA!",0,50);    
    
    canvasContext.fillrect(5,5,200,30);
    console.log("inited")
}

function drawBoard(dataArr){
       
}
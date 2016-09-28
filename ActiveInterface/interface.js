var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var menuPage = true;
var refreshTime = 17;
window.onload = function(){

    var framesPerSecond = 60;

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

function initBoard(){
    console.log("initing")
}

function drawBoard(dataArr){
    console.log("drawing")
}

function checkForStart(dataArr){
    
    for(var i = 0; i < dataArr.length; i++){
        for(var j = 0; j < dataArr[i].length;j++){
            if(dataArr[i][j] === "*"){
                if(i > 16 && (j > 2 && j < 22)){
                    console.log("selected");
                    menuPage = false;


                    window.location = "menu.html";
                }
            }
        }
    }
}

function runMenuPage(){

}
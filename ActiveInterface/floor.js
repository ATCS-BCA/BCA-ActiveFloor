var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var ctx;
var canvas;
var firstTime = true;
var sensorDiv = 8;
var text, parser, xmlDoc;
var framesPerSecond = 60;

$(document).ready(function () {
    'use strict';

    // Start getting floor data automatically (assuming Floor Server is running).
    startRefresh();
    
    sendSemaphore(function() {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");
        
    });
});

function initCanvas(){
    canvas = document.getElementById('floorCanvas');
    canvas.width = ledsX;
    canvas.height = ledsY;
    ctx = canvas.getContext('2d');
}

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
        
        drawBoard(dataHolderArray);
    });
}

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {refreshXML(); }, refreshTime);
}
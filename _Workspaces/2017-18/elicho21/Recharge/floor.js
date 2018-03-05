/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;       // Run the loop every 17 milliseconds

function initCanvas(arr) {
    'use strict';
    canvas = document.getElementById('floorCanvas');
    canvas.width = 192;
    canvas.height = 192;
    context2D = canvas.getContext('2d');
    
    var i, tempRow, p, srchStr, tempX, tempY;
    for (i = 0; i < arr.length; i += 1) {
        tempRow = arr[i];

        for (p = 0; p < tempRow.length; p += 1) {
            srchStr = tempRow.substring(p, p + 1);
            if (srchStr === charSearch) {
                tempX = p * ledPerSensorX;
                tempY = i * ledPerSensorY;
                manageTap(tempX, tempY);
            }
        }
    }
}

function loop() {
    'use strict';
    $.get('http://activefloor.bca.bergen.org:8080/', function (data) {
        dataHolderArray = [];

        /* Assign the fields from the XML to Javascript variables. */
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

        /* Load the data from the XML file into the dataHolderArray */
        $(data).find('Row').each(function () {
            var $row, rowNum, rowVal, n;
            $row = $(this);
            rowNum = $row.attr('rownum');
            rowVal = $row.attr('values');
            n = rowVal.split(charDivide).join('');

            dataHolderArray.push(n);
        });
    });
    initCanvas(dataHolderArray);
    drawScreen();
    time += 0.017;
}

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

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {loop();}, refreshTime);
}

function stopRefresh() {
    'use strict';
    clearInterval(myInterval);
}

function onMouseClick(event) {
    var mouseX = event.clientX;
    var mouseY = event.clientY;
    mouseX -= canvas.offsetLeft;
    mouseY -= canvas.offsetTop;

    manageTap(mouseX, mouseY);

    // console.log("X: " + mouseX + " Y: " + mouseY);
}

function inRange (xPos, yPos, xMin, xMax, yMin, yMax) {
    return (xPos >= xMin && xPos <= xMax && yPos >= yMin && yPos <= yMax)
}

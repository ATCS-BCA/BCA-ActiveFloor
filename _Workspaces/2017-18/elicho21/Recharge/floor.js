/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;       // Run the loop every 17 milliseconds
var interval;
var existing = [];
var time = 0;
var lastSpawn = 0;
var radius = 24;
var lifespan = 5;
var spawnRate = 10;
var trans = [];
var transTime  = 1;
var score = 0;
var level = 0;

function drawCanvas(arr) {
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
                checkTap(tempX, tempY);
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
    drawCanvas(dataHolderArray);
    managePositions();
    drawScore();
    manageDifficulty();
    drawCircles();
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
    addPosition();
    myInterval = setInterval(function () {loop();}, refreshTime);
    // interval = setTimeout(addPosition, 2000);
    // interval = setInterval(function () {addPosition();}, 1000);
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

    checkTap(mouseX, mouseY);

    // console.log("X: " + mouseX + " Y: " + mouseY);
}

function checkTap (xPos, yPos) {
    for (var i = 0; i < existing.length; i++) {
        if (xPos < existing[i].xPos + radius && xPos > existing[i].xPos - radius &&
            yPos < existing[i].yPos + radius && yPos > existing[i].yPos - radius) {
            addResult = addPosition();
            trans.push({
                xStart: existing[i].xPos,
                yStart: existing[i].yPos,
                xEnd: addResult[0],
                yEnd: addResult[1],
                startTime: time
            });
            score += 1;
            existing.splice(i, 1);
        }
    }
}
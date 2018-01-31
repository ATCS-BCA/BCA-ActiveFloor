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

        /* Redraw the screen based upon the data in the array. */
        drawCanvas(dataHolderArray);
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

function drawCircle(id, xPos, yPos) {
    'use strict';
    context2D.save();

    context2D.globalAlpha = 0.8;
    if (time - existing[id].timeSpawned < lifespan / 3) {
        context2D.fillStyle = "lime";
    } else if (time - existing[id].timeSpawned < 2 * lifespan / 3) {
        context2D.fillStyle = "yellow";
    } else {
        context2D.fillStyle = 'red';
    }

    context2D.beginPath();
    context2D.arc(xPos, yPos, radius, 0, Math.PI * 2, true);
    context2D.closePath();
    context2D.fill();

    context2D.restore();

    context2D.strokeStyle = "white";
    context2D.lineWidth = 3;
    context2D.stroke();

    context2D.save();
    context2D.translate(xPos, yPos);
    context2D.beginPath();
    context2D.moveTo(0, 0);
    context2D.rotate((time - existing[id].timeSpawned) / lifespan * 2 * Math.PI);
    context2D.lineTo(0, -radius);
    context2D.stroke();
    context2D.restore();

    context2D.font = radius + "px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText((lifespan - Math.floor(time - existing[id].timeSpawned)).toString(), xPos, yPos);
}

function drawCircles () {
    "use strict";
    for (var i = 0; i < existing.length; i++) {
        var x = 0;
        var y = 0;
        x = existing[i].xPos;
        y = existing[i].yPos;
        drawCircle(i, x, y);
    }
    for (var i = 0; i < trans.length; i++) {
        var xStart = trans[i].xStart;
        var yStart = trans[i].yStart;
        var xEnd = trans[i].xEnd;
        var yEnd = trans[i].yEnd;
        var startTime = trans[i].startTime;
        if (time >= startTime + transTime) {
            trans.splice(i, 1);
            continue;
        }
        drawTransition(xStart, yStart, xEnd, yEnd, startTime);
    }
    // console.log(existing);
}

function drawTransition(xStart, yStart, xEnd, yEnd, startTime) {

    xPos = lerp(xStart, xEnd, (time - startTime) / transTime);
    yPos = lerp(yStart, yEnd, (time - startTime) / transTime);

    context2D.beginPath();
    context2D.arc(xPos, yPos, radius, 0, Math.PI * 2, true);
    context2D.closePath();

    context2D.strokeStyle = "white";
    context2D.lineWidth = 3;
    context2D.stroke();
}

function addPosition () {
    "use strict";
    var xPos = Math.floor(Math.random() * (192 - radius * 2)) + radius;
    var yPos = Math.floor(Math.random() * (192 - radius * 2)) + radius;
    setTimeout(function () {
        existing.push({"xPos" : xPos, "yPos" : yPos, "timeSpawned" : time});
    }, transTime * 1000);
    return [xPos, yPos];
}

function managePositions() {
    // console.log(time);
    if (time >= lastSpawn + spawnRate) {
        addPosition();
        lastSpawn = time;
    }

    for (var i = 0; i < existing.length; i++) {
        if (time > existing[i].timeSpawned + lifespan) {
            existing.splice(i, 1);
        }
    }
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

function manageDifficulty () {
    spawnRate = 10 * Math.pow(0.95, Math.floor(score / 5));
    transTime = Math.pow(0.95, Math.floor(score / 5));
    radius = 24 * Math.pow(0.99, Math.floor(score / 5));
    lifespan = 5 * Math.pow(0.99, Math.floor(score / 5));
}

function drawScore () {
    context2D.font = "10px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "left";
    context2D.textBaseline = "top";
    context2D.fillText("Score: " + score, 5, 5);
}

function lerp(a, b, n) {
    return n * (b - a) + a;
}
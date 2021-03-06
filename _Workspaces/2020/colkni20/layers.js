//Cole Knie
/*jslint browser: true*/
/*global $, jQuery*/

var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var cn = 0;
var screenArray = [];
var layerArrayList = [];
var newarray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;       // Run the loop every 17 milliseconds
var msCounter = 0;
var secondCounter = 0;
var currentLayer = 1;
function getScreenArray() {

    for (var a = 0; a < 24; a++) {
        for (var b = 0; b < 24; b++) {
            screenArray[a][b] = {};
            (screenArray[a][b]).value = false;
            (screenArray[a][b]).color = "none";
            (screenArray[a][b]).seed = (Math.random()) * 1.5;

        }
    }
    for (var d = 0; d < layerArrayList.length; d++) {
        for (var e = 0; e < layerArrayList[0].length; e++) {
            for (var f = 0; f < layerArrayList[0][0].length; f++) {
                if (!layerArrayList[d][e][f].value && (!layerArrayList[d][e][f].eq("none"))) {
                    screenArray[e][f].color = layerArrayList[d][e][f].color;
                    screenArray[e][f].value = layerArrayList[d][e][f].value;
                    screenArray[e][f].seed = layerArrayList[d][e][f].seed;
                }
            }
        }
    }
}
function calculatedRainbowResult(seconds) {
    if(seconds>=0 && seconds < 0.5){
        return "blue";
    }
    else if(seconds>=.5 && seconds < 1){
        return "green";
    }
    else if(seconds>= 1 && seconds < 1.5){
        return "orange";
    }
    else if(seconds>=1.5 && seconds < 2){
        return "purple";
    }
    return "yellow";
}
function drawObj(type, xPos, yPos, size, colorchoice) {
    'use strict';
    context2D.fillStyle = colorchoice;

    if (type === 'square') {
        context2D.fillRect((xPos + (xCenter / size)), (yPos + (yCenter / size)), size, size);
    } else if (type === 'circle') {
        context2D.beginPath();
        context2D.arc((xPos + xCenter), (yPos + yCenter), size, 0, Math.PI * 2, true);
        context2D.closePath();
        context2D.fill();
    }
}
function updateScreenArray(arr) {
    'use strict';
    canvas = document.getElementById('floorCanvas');
    canvas.width = ledsX;
    canvas.height = ledsY;
    context2D = canvas.getContext('2d');

    var i, tempRow, p, srchStr;
    for (i = 0; i < arr.length; i += 1) {
        tempRow = arr[i];

        for (p = 0; p < tempRow.length; p += 1) {
            console.log(layerArrayList.length);
//             console.log("i=" + i, ";p=" + p);
            srchStr = tempRow.substring(p, p + 1);
            if (srchStr === charSearch) {
                (layerArrayList[currentLayer][i][p]).value = true;
                if (brushcolor == "eraser"){
                    layerArrayList[currentLayer][i][p].value = false;
                    layerArrayList[currentLayer][i][p].color = "none";
                }
                if(i == 0 && p == 0){
                    brushcolor = "red";
                }
                if(i == 23 && p == 23){
                    brushcolor = "blue";
                }
                /*if(i == 12 && p == 12){
                    brushcolor = "rainbow";
                }*/
                if(i == 0 && p == 23){
                    brushcolor = "green";
                }
            }
        }
    }
}
brushcolor = 'red';
function drawScreenArray() {
    getScreenArray();

    for (var i = 0; i < screenArray.length; i += 1) {
        var tempRow = screenArray[i];

        for (var p = 0; p < tempRow.length; p += 1) {
            if ((layerArrayList[currentLayer][i][p]).value) {
                var tempX = p * ledPerSensorX;
                var tempY = i * ledPerSensorY;
                if (((layerArrayList[currentLayer][i][p]).color) == "none") {
                    (layerArrayList[currentLayer][i][p]).color = brushcolor;
                    getScreenArray();

                }
                if ((screenArray[i][p]).color != "rainbow") {
                    drawObj('square', tempX, tempY, 5, (screenArray[i][p]).color);
                }

                else{
                    drawObj('square', tempX, tempY, 5, calculatedRainbowResult(secondCounter/15+screenArray[i][p].seed));
                }

                msCounter += 17;
                secondCounter = msCounter/1000;
                if (secondCounter >= 30.017){
                    msCounter=0;
                    secondCounter=0;
                }

            }
            /*if (tempX >= 90 && tempX <= 96 && tempY >= 0 && tempY <= 2){

                for (var apple = 0; apple < 24; apple++){
                    for (var ban = 0; b < 24; ban++){
                        (screenArray[apple][ban]).value = false;
                        (screenArray[apple][ban]).color = "none";
                    }
                }
            }*/

            if (tempX >= 0 && tempX <= 2 && tempY >= 0 && tempY <= 2){
                brushcolor = 'red';
                screenArray[i][p].value = false;

            }
            else if (tempX >= 0 && tempX <= 2 && tempY >= 184 && tempY <= 186) {
                brushcolor = "eraser";
                screenArray[i][p].value = false;
            }
            else if (tempX >= 184 && tempX <= 186 && tempY >= 184 && tempY <= 186) {
                brushcolor = "blue";
                screenArray[i][p].value = false;
            }
            else if (tempX >= 184 && tempX <= 186 && tempY >= 0 && tempY <= 2) {
                brushcolor = "green";
                screenArray[i][p].value = false;
            }
            cn = 0;
            fox = 0;
            drawObj('square', fox, cn, 5, 'red');
            drawObj('square', fox+2, cn+1, 5, 'red');
            drawObj('square', fox+1, cn+1, 5, 'red');
            drawObj('square', fox, cn+1, 5, 'red');
            drawObj('square', fox+1, cn, 5, 'red');
            drawObj('square', fox, cn+2, 5, 'red');
            drawObj('square', fox+1, cn+2, 5, 'red');
            drawObj('square', fox+2, cn+2, 5, 'red');
            drawObj('square', fox+2, cn, 5, 'red');
            fox = 0;
            drawObj('square', 184, cn, 5, 'green');
            drawObj('square', 184+2, cn+1, 5, 'green');
            drawObj('square', 184+1, cn+1, 5, 'green');
            drawObj('square', 184, cn+1, 5, 'green');
            drawObj('square', 184+1, cn, 5, 'green');
            drawObj('square', 184, cn+2, 5, 'green');
            drawObj('square', 184+1, cn+2, 5, 'green');
            drawObj('square', 184+2, cn+2, 5, 'green');
            drawObj('square', 184+2, cn, 5, 'green');
            cn = 184;
            drawObj('square', 0, cn, 5, 'pink');
            drawObj('square', 2, cn+1, 5, 'pink');
            drawObj('square', 1, cn+1, 5, 'pink');
            drawObj('square', 0, cn+1, 5, 'pink');
            drawObj('square', 1, cn, 5, 'pink');
            drawObj('square', 0, cn+2, 5, 'pink');
            drawObj('square', 1, cn+2, 5, 'pink');
            drawObj('square', 2, cn+2, 5, 'pink');
            drawObj('square', 2, cn, 5, 'pink');
            fox=184;
            drawObj('square', fox, cn, 5, 'blue');
            drawObj('square', fox+2, cn+1, 5, 'blue');
            drawObj('square', fox+1, cn+1, 5, 'blue');
            drawObj('square', fox, cn+1, 5, 'blue');
            drawObj('square', fox+1, cn, 5, 'blue');
            drawObj('square', fox, cn+2, 5, 'blue');
            drawObj('square', fox+1, cn+2, 5, 'blue');
            drawObj('square', fox+2, cn+2, 5, 'blue');
            drawObj('square', fox+2, cn, 5, 'blue');
            fox  = 90;
            cn = 90;

            cn-= 7;

            cn += 7;
            fox -= 7;

        }
    }
}


function loop() {
    'use strict';
    $.get('http://HK-138-01.bergen.org:8080/', function (data) {
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
        updateScreenArray(dataHolderArray);
        drawScreenArray();
    });
}

$(document).ready(function () {
    'use strict';

    // Default screen array to 24x24 and set to false
//    for (i = 0; i < 24; i++)
//        screenArray.push([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);

    screenArray = new Array(24);
    for (var i = 0; i < 24; i++) {
        screenArray[i] = new Array(24);
    }

    for (var a = 0; a < 24; a++) {
        for (var b = 0; b < 24; b++) {
            screenArray[a][b] = {};
            (screenArray[a][b]).value = false;
            (screenArray[a][b]).color = "none";
            (screenArray[a][b]).seed = (Math.random()) * 1.5;

        }
    }
    for (var c = 0; a < 24; a++) {
        for (var a = 0; a < 24; a++) {
            for (var b = 0; b < 24; b++) {
                layerArrayList[c] = {};
                (layerArrayList[c][a][b]).value = false;
                (layerArrayList[c][a][b]).color = "none";
                (layerArrayList[c][a][b]).seed = (Math.random()) * 1.5;

            }
        }
    }
    layerArrayList[0][10][10].value= true;
    layerArrayList[0][10][10].brushcolor= "red";
    layerArrayList[0][10][10].seed = (Math.random()) * 1.5;



    // Start getting floor data automatically (assuming Floor Server is running).
    startRefresh();

    sendSemaphore(function() {
        // ClearF spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");

    });
});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {loop(); }, refreshTime);
}

function stopRefresh() {
    'use strict';
    clearInterval(myInterval);
}


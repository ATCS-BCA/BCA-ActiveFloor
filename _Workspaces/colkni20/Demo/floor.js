//Cole Knie
/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var cn = 0;
var screenArray = [];
var newarray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;       // Run the loop every 17 milliseconds
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
//             console.log("i=" + i, ";p=" + p);
            srchStr = tempRow.substring(p, p + 1);
            if (srchStr === charSearch) {
                (screenArray[i][p]).value = true;
                if (brushcolor == "eraser"){
                    screenArray[i][p].value = false;
                    screenArray[i][p].color = "none";
                }
                if(i == 0 && p == 0){
                    brushcolor = "red";
                }
                if(i == 23 && p == 23){
                    brushcolor = "blue";
                }
                if(i == 12 && p == 12){
                    brushcolor = "blue";
                }
                if(i == 0 && p == 23){
                    brushcolor = "green";
                }
            }
         }
     }
}
brushcolor = 'red';
function drawScreenArray() {

    for (var i = 0; i < screenArray.length; i += 1) {
        var tempRow = screenArray[i];

        for (var p = 0; p < tempRow.length; p += 1) {
            if ((screenArray[i][p]).value) {
                var tempX = p * ledPerSensorX;
                var tempY = i * ledPerSensorY;
                if (((screenArray[i][p]).color) == "none") {
                    (screenArray[i][p]).color = brushcolor;

                }
                if ((screenArray[i][p]).color != "rainbow") {
                    drawObj('square', tempX, tempY, 5, (screenArray[i][p]).color);
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
                else if ((screenArray[12][12]).value ){
                    var randcolor = Math.floor(Math.random()*4);
                    if(randcolor%4 == 0)
                        brushcolor = "purple";
                    else if(randcolor%2 == 0)
                        brushcolor = "red";
                    else if(randcolor%3 == 0)
                        brushcolor = "green";
                    else{
                        brushcolor = "green"
                    }
                    screenArray[12][12].value = false;
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
                drawObj('square', fox, cn, 5, 'white');
                drawObj('square', fox+2, cn+1, 5, 'red');
                drawObj('square', fox+1, cn+1, 5, 'blue');
                drawObj('square', fox, cn+1, 5, 'yellow');
                drawObj('square', fox+1, cn, 5, 'green');
                drawObj('square', fox, cn+2, 5, 'purple');
                drawObj('square', fox+1, cn+2, 5, 'white');
                drawObj('square', fox+2, cn+2, 5, 'red');
                drawObj('square', fox+2, cn, 5, 'orange');
                cn+=7;
                fox+=7;
                drawObj('square', fox, cn, 5, 'white');
                drawObj('square', fox+2, cn+1, 5, 'red');
                drawObj('square', fox+1, cn+1, 5, 'blue');
                drawObj('square', fox, cn+1, 5, 'yellow');
                drawObj('square', fox+1, cn, 5, 'green');
                drawObj('square', fox, cn+2, 5, 'purple');
                drawObj('square', fox+1, cn+2, 5, 'white');
                drawObj('square', fox+2, cn+2, 5, 'red');
                drawObj('square', fox+2, cn, 5, 'orange');
                cn-= 7;
                drawObj('square', fox, cn, 5, 'white');
                drawObj('square', fox+2, cn+1, 5, 'red');
                drawObj('square', fox+1, cn+1, 5, 'blue');
                drawObj('square', fox, cn+1, 5, 'yellow');
                drawObj('square', fox+1, cn, 5, 'green');
                drawObj('square', fox, cn+2, 5, 'purple');
                drawObj('square', fox+1, cn+2, 5, 'white');
                drawObj('square', fox+2, cn+2, 5, 'red');
                drawObj('square', fox+2, cn, 5, 'orange');
                cn += 7;
                fox -= 7;
                drawObj('square', fox, cn, 5, 'white');
                drawObj('square', fox+2, cn+1, 5, 'red');
                drawObj('square', fox+1, cn+1, 5, 'blue');
                drawObj('square', fox, cn+1, 5, 'yellow');
                drawObj('square', fox+1, cn, 5, 'green');
                drawObj('square', fox, cn+2, 5, 'purple');
                drawObj('square', fox+1, cn+2, 5, 'white');
                drawObj('square', fox+2, cn+2, 5, 'red');
                drawObj('square', fox+2, cn, 5, 'orange');

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

    for (var a = 0; a < 24; a++){
        for (var b = 0; b < 24; b++){
            screenArray[a][b] = {};
            (screenArray[a][b]).value = false;
            (screenArray[a][b]).color = "none";
        }
    }


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
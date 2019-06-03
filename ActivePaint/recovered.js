//Cole Knie
/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
toolCounterY=0;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var cn = 0;
var screenArray = [];
var newarray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;       // Run the loop every 17 milliseconds
var msCounter = 0;
var secondCounter = 0;
var tool = "brush";
function makeButton(y, color){
    setButton(y, 0, color);
    setButton(y, 1, color);
    setButton(y+1, 0, color);
    setButton(y+1, 1, color);
}
function setButton(y,x, color){
    screenArray[y][x].buttonColor = color;
    screenArray[y][x].button = true;
    if(color==="eraser"){
        color = "pink";
    }
    screenArray[y][x].buttonAppearence = color;
}
function paintBucket (node, color, changeVal) {
    changeVal = true;
    if (!node.locked) {
        if (color === "eraser") {
            color = "none";
            changeVal = false;
        }

        node.selected = true;
        var left = false;
        var right = false;
        var up = false;
        var down = false;
        if (!color !== (node.color)) {
            if (node.left != null && node.left.color === (node.color) && !node.left.selected) {
                left = true;
            }
            if (node.right != null && node.right.color === (node.color) && !node.right.selected) {
                right = true;
            }
            if (node.up != null && node.up.color === (node.color) && !node.up.selected) {
                up = true;
            }
            if (node.down != null && node.down.color === (node.color) && !node.down.selected) {
                down = true;
            }
            node.value = changeVal;
            node.color = color;
            node.selected = true;
            if (left) {
                paintBucket(node.left, color, changeVal);
            }
            if (right) {
                paintBucket(node.right, color, changeVal);
            }
            if (up) {
                paintBucket(node.up, color, false, changeVal);
            }
            if (down) {
                paintBucket(node.down, color, false, changeVal);
            }
        }
    }

}
function clearSelection() {
    for (var a = 0; a < 24; a++){
        for (var b = 0; b < 24; b++){
            screenArray[a][b].selected = false;
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
//             console.log("i=" + i, ";p=" + p);
            srchStr = tempRow.substring(p, p + 1);
            if (srchStr === charSearch) {
                (screenArray[i][p]).value = true;
                if (brushcolor === "eraser"){
                    screenArray[i][p].value = false;
                    screenArray[i][p].color = "none";
                }
                if(screenArray[i][p].button){
                    brushcolor=screenArray[i][p].buttonColor;
                }
                if ((i+p)===46){
                    tool = "bucket";
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
                var tempX = p * ledPerSensorX;
                var tempY = i * ledPerSensorY;
            if ((screenArray[i][p]).value && !screenArray[i][p].locked) {
                if (tool === "brush" && ((screenArray[i][p]).color) === "none") {
                    (screenArray[i][p]).color = brushcolor;
                }

                if ((screenArray[i][p]).color !== "rainbow") {
                    drawObj('square', tempX, tempY, 8, (screenArray[i][p]).color);
                }

                else{
                    drawObj('square', tempX, tempY, 8, calculatedRainbowResult(secondCounter/15+screenArray[i][p].seed));
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
            if(screenArray[i][p].button){
                if(screenArray[i][p].buttonAppearence==="rainbow"){
                    drawObj('square', tempX, tempY, 8, calculatedRainbowResult(secondCounter/15+screenArray[i][p].seed));
                }
                else{
                    drawObj('square', tempX, tempY, 8, (screenArray[i][p]).buttonAppearence);
                }
            }
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

    for (var a = 0; a < 24; a++){
        for (var b = 0; b < 24; b++){
            screenArray[a][b] = {};
            (screenArray[a][b]).value = false;
            (screenArray[a][b]).row = a;
            (screenArray[a][b]).column = b;
            (screenArray[a][b]).color = "none";
            (screenArray[a][b]).left = null;
            (screenArray[a][b]).right = null;
            (screenArray[a][b]).up = null;
            (screenArray[a][b]).down = null;
            (screenArray[a][b]).seed = (Math.random())*1.5;
            (screenArray[a][b]).selected = false;
            (screenArray[a][b]).button = false;
            (screenArray[a][b]).buttonColor = null;
            (screenArray[a][b]).locked = a<2 || b<2;
            (screenArray[a][b]).buttonAppearence= null;

        }
    }
    makeButton(0, "red");
    makeButton(3, "green");
    makeButton(6, "blue");
    makeButton(9, "purple");
    makeButton(12, "rainbow");
    makeButton(15, "eraser");




    for (var a = 0; a < 24; a++) {
        for (var b = 0; b < 24; b++) {
            if(b>0){(screenArray[a][b]).left=(screenArray[a][b-1]);}
            if(b<23){(screenArray[a][b]).right=(screenArray[a][b+1]);}
            if(a<23){(screenArray[a][b]).down=(screenArray[a+1][b]);}
            if(a>0){(screenArray[a][b]).up=(screenArray[a-1][b]);}

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
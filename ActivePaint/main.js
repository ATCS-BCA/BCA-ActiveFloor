//Cole Knie
/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
toolCounterY=0;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var layerCount = 1;
var screenArray = [];
var layerArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 20;       // Run the loop every 17 milliseconds
var msCounter = 0;
var secondCounter = 0;
var tool = "brush";
var redLocation = 0;
var greenLocation = 3;
var blueLocation = 6;
var purpleLocation = 9;
var rainbowLocation = 12;
var eraserLocation = 15;
brushCoordinates = [2, 22];
bucketCoordinates = [5, 22];
brushcolor = 'red';
var occupied = false;
var currentLayer = 0;
function moveUp() {
    if(currentLayer<(layerCount-1)){
        currentLayer++;
    }
}
function moveDown() {
    if(currentLayer>=1) {
        currentLayer--;
    }
}
function addLayer() {
    layerArray.add({});
    layerArray[layerCount].visible = true;
    layerArray[layerCount].arr = new Array(24);
    for (var i = 0; i < 24; i++) {
        layerArray[layerCount].arr[i] = new Array(24);
    }
    for (var a = 0; a < 24; a++) {
        for (var b = 0; b < 24; b++) {
            layerArray[layerCount].arr[a][b] = {};
            (layerArray[layerCount].arr[a][b]).value = false;
            (layerArray[layerCount].arr[a][b]).row = a;
            (layerArray[layerCount].arr[a][b]).column = b;
            (layerArray[layerCount].arr[a][b]).color = "none";
            (layerArray[layerCount].arr[a][b]).left = null;
            (layerArray[layerCount].arr[a][b]).right = null;
            (layerArray[layerCount].arr[a][b]).up = null;
            (layerArray[layerCount].arr[a][b]).down = null;
            (layerArray[layerCount].arr[a][b]).seed = (Math.random()) * 1.5;
            (layerArray[layerCount].arr[a][b]).selected = false;
            (layerArray[layerCount].arr[a][b]).button = false;
            (layerArray[layerCount].arr[a][b]).buttonColor = null;
            (layerArray[layerCount].arr[a][b]).locked = a < 2 || a > 21 || b < 2 || b > 21;
            (layerArray[layerCount].arr[a][b]).buttonAppearence = null;
            (layerArray[layerCount].arr[a][b]).transferTool = null;
            (layerArray[layerCount].arr[a][b]).hold = false;
            (layerArray[layerCount].arr[a][b]).arrow = 0;
            (layerArray[layerCount].arr[a][b]).addLayer = null;
            (layerArray[layerCount].arr[a][b]).hide = false;
        }
    }
    for (var a = 0; a < 24; a++) {
        for (var b = 0; b < 24; b++) {
            if (b > 0) {
                (layerArray[layerCount].arr[a][b]).left = (layerArray[layerIndex].arr[a][b - 1]);
            }
            if (b < 23) {
                (layerArray[layerCount].arr[a][b]).right = (layerArray[layerIndex].arr[a][b + 1]);
            }
            if (a < 23) {
                (layerArray[layerCount].arr[a][b]).down = (layerArray[layerIndex].arr[a + 1][b]);
            }
            if (a > 0) {
                (layerArray[layerCount].arr[a][b]).up = (layerArray[layerIndex].arr[a - 1][b]);
            }
        }
    }
    makeButton(redLocation, "red");
    makeButton(greenLocation, "green");
    makeButton(blueLocation, "blue");
    makeButton(purpleLocation, "purple");
    makeButton(rainbowLocation, "rainbow");
    makeButton(eraserLocation, "eraser");
    makeTransferTool(bucketCoordinates[0], bucketCoordinates[1], "bucket");
    makeTransferTool(brushCoordinates[0], brushCoordinates[1], "brush");

    currentLayer=layerCount;
    layerCount++;
}

function deleteLayer() {
    if(layerCount!==1) {
        layerArray.splice(currentLayer, 1);
        currentLayer--;
    }
    else{
        for (var a = 0; a < 24; a++) {
            for (var b = 0; b < 24; b++) {
                layerArray[0].arr[a][b] = {};
                (layerArray[0].arr[a][b]).value = false;
                (layerArray[0].arr[a][b]).row = a;
                (layerArray[0].arr[a][b]).column = b;
                (layerArray[0].arr[a][b]).color = "none";
                (layerArray[0].arr[a][b]).left = null;
                (layerArray[0].arr[a][b]).right = null;
                (layerArray[0].arr[a][b]).up = null;
                (layerArray[0].arr[a][b]).down = null;
                (layerArray[0].arr[a][b]).seed = (Math.random()) * 1.5;
                (layerArray[0].arr[a][b]).selected = false;
                (layerArray[0].arr[a][b]).button = false;
                (layerArray[0].arr[a][b]).buttonColor = null;
                (layerArray[0].arr[a][b]).locked = a < 2 || a > 21 || b < 2 || b > 21;
                (layerArray[0].arr[a][b]).buttonAppearence = null;
                (layerArray[0].arr[a][b]).transferTool = null;
                (layerArray[0].arr[a][b]).hold = false;
                (layerArray[layerCount].arr[a][b]).arrow = 0;
                (layerArray[layerCount].arr[a][b]).addLayer = null;
                (layerArray[layerCount].arr[a][b]).hide = false;
            }
        }
        currentLayer=0;
    }
    layerCount--;
}

function setVisualArray(){
    for (var a = 0; a < 24; a++){
        for (var b = 0; b < 24; b++){
            screenArray[a][b].color = "none";
            screenArray[a][b].value = false;
        }
    }
    for (var layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        if(layerArray[layerIndex].visible){
            for (var a = 0; a < 24; a++) {
                for (var b = 0; b < 24; b++) {
                    if(layerArray[layerIndex].arr[a][b].value){
                        screenArray[a][b].value = true;
                        screenArray[a][b].color=layerArray[layerIndex].arr[a][b].color;
                    }
                }
            }
        }
    }
}
function setSingleTransferTool(x, y, type){
    for (var layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        layerArray[layerIndex].arr[x][y].transferTool = type;
    }
}
function makeTransferTool(x,y, type) {
    setSingleTransferTool(x, y, type);
    setSingleTransferTool(x, y + 1, type);
    setSingleTransferTool(x+1, y, type);
    setSingleTransferTool(x+1, y + 1, type);
}

function makeButton(y, color){
    setButton(y, 0, color);
    setButton(y, 1, color);
    setButton(y+1, 0, color);
    setButton(y+1, 1, color);
}
function setButton(y,x, color){
    for (var layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        layerArray[layerIndex].arr[y][x].buttonColor = color;
        layerArray[layerIndex].arr[y][x].button = true;
        if (color === "eraser") {
            color = "pink";
        }
        layerArray[layerIndex].arr[y][x].buttonAppearence = color;
    }
}
function paintBucket (node, color, changeVal) {

    node.selected = true;

    if ((color !== (node.color)) && (!node.locked)) {
        var left = (node.left != null) && (node.left.color === (node.color)) && (!node.left.selected);
        var right = (node.right != null) && (node.right.color === (node.color)) && (!node.right.selected);
        var up = (node.up != null) && (node.up.color === (node.color)) && (!node.up.selected);
        var down = (node.down != null) && (node.down.color === (node.color)) && (!node.down.selected);

        node.value = changeVal;
        node.color = color;
        if (left) {
            node.left.selected = true;
        }
        if (right) {
            node.right.selected = true;
        }
        if (up) {
            node.up.selected = true;
        }
        if (down) {
            node.down.selected = true;
        }
        if (left) {
            paintBucket(node.left, color, changeVal);
        }
        if (right) {
            paintBucket(node.right, color, changeVal);
        }
        if (up) {
            paintBucket(node.up, color, changeVal);
        }
        if (down) {
            paintBucket(node.down, color, changeVal);
        }
    }
}
function clearSelection() {

    for (var layerIndex = 0; layerIndex < layerCount; layerIndex++) {

        for (var a = 0; a < 24; a++) {
            for (var b = 0; b < 24; b++) {
                layerArray[layerIndex].arr[a][b].selected = false;
            }
        }
    }
}
function calculatedRainbowResult(seconds) {
    if(seconds>=0 && seconds < 2){
        return "blue";
    }
    else if(seconds < 4){
        return "green";
    }
    else if(seconds < 6){
        return "orange";
    }
    else if(seconds < 8){
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
                //                if(layerArray[currentLayer].arr[i][p].locked && !layerArray[currentLayer].arr[i][p].hold){
                if(true){
                    if(layerArray[currentLayer].arr[i][p].button){
                        brushcolor=layerArray[currentLayer].arr[i][p].buttonColor;
                    }
                    else if (layerArray[currentLayer].arr[i][p].transferTool !== null){
                        tool = layerArray[currentLayer].arr[i][p].transferTool.toString();
                    }
                    else if (layerArray[currentLayer].arr[i][p].arrow>0){
                        moveUp();
                    }
                    else if (layerArray[currentLayer].arr[i][p].arrow<0){
                        moveDown();
                    }
                    else if (layerArray[currentLayer].arr[i][p].addLayer > 0){
                        addLayer();
                    }
                    else if (layerArray[currentLayer].arr[i][p].addLayer < 0){
                        deleteLayer();
                    }
                    else if (layerArray[currentLayer].arr[i][p].hide){
                        layerArray[currentLayer].visible = !layerArray[currentLayer].visible;
                    }
                }
                if(!(layerArray[currentLayer].arr[i][p].locked) && tool === "brush") {


                    if (brushcolor === "eraser") {
                        layerArray[currentLayer].arr[i][p].value = false;
                        console.log("trying to erase");
                        layerArray[currentLayer].arr[i][p].color = "none";

                    }
                    else if (!layerArray[currentLayer].arr[i][p].value){
                        console.log("writing");
                        (layerArray[currentLayer].arr[i][p]).value = true;
                        (layerArray[currentLayer].arr[i][p]).color = brushcolor;
                    }
                    setVisualArray();
                    console.log((screenArray[i][p].value)===(layerArray[currentLayer].arr[i][p].value));
                }
                else if(tool === "bucket" && !layerArray[currentLayer].arr[i][p].locked) {


                    if(brushcolor==="eraser"){
                        paintBucket(layerArray[currentLayer].arr[i][p], "none", false);
                    }
                    else {
                        paintBucket(layerArray[currentLayer].arr[i][p], brushcolor, true);
                    }
                    clearSelection();
                }

            }
            else if (layerArray[currentLayer].arr[i][p].hold){
                layerArray.arr[i][p].hold = false;
            }
        }
    }
}
function drawScreenArray() {
    for (var i = 0; i < layerArray[currentLayer].arr.length; i += 1) {

        var tempRow = layerArray[currentLayer].arr[i];

        for (var p = 0; p < tempRow.length; p += 1) {
            var tempX = p * ledPerSensorX;
            var tempY = i * ledPerSensorY;
            setVisualArray();
            if ((screenArray[i][p]).value && !layerArray[currentLayer].arr[i][p].locked) {
                if ((screenArray[i][p]).color !== "rainbow") {
                    drawObj('square', tempX, tempY, 8, screenArray[i][p].color);
                }


                else{
                    drawObj('square', tempX, tempY, 8, calculatedRainbowResult(secondCounter));
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
            if(layerArray[currentLayer].arr[i][p].button){
                if(layerArray[currentLayer].arr[i][p].buttonAppearence==="rainbow"){
                    drawObj('square', tempX, tempY, 8, calculatedRainbowResult(secondCounter));
                }
                else{
                    drawObj('square', tempX, tempY, 8, (layerArray[currentLayer].arr[i][p]).buttonAppearence);
                }
            }
        }
    }
    msCounter += 20;
    secondCounter = msCounter/1000;
    if (secondCounter > 10){
        msCounter=0;
        secondCounter=0;
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
        drawToolBar();
    });
}

$(document).ready(function () {
    'use strict';

    // Default screen array to 24x24 and set to false
//    for (i = 0; i < 24; i++)
//        screenArray.push([false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false, false]);
    layerCount = 1;
    layerArray = new Array(layerCount);
    for (var layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        layerArray[layerIndex] = {};
        layerArray[layerIndex].arr = new Array (24);
        layerArray[layerIndex].visible = true;

        for (var i = 0; i < 24; i++) {
            layerArray[layerIndex].arr[i] = new Array(24);
        }
    }

    for (var layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        for (var a = 0; a < 24; a++) {
            for (var b = 0; b < 24; b++) {
                layerArray[layerIndex].arr[a][b] = {};
                (layerArray[layerIndex].arr[a][b]).value = false;
                (layerArray[layerIndex].arr[a][b]).row = a;
                (layerArray[layerIndex].arr[a][b]).column = b;
                (layerArray[layerIndex].arr[a][b]).color = "none";
                (layerArray[layerIndex].arr[a][b]).left = null;
                (layerArray[layerIndex].arr[a][b]).right = null;
                (layerArray[layerIndex].arr[a][b]).up = null;
                (layerArray[layerIndex].arr[a][b]).down = null;
                (layerArray[layerIndex].arr[a][b]).seed = (Math.random()) * 1.5;
                (layerArray[layerIndex].arr[a][b]).selected = false;
                (layerArray[layerIndex].arr[a][b]).button = false;
                (layerArray[layerIndex].arr[a][b]).buttonColor = null;
                (layerArray[layerIndex].arr[a][b]).locked = a < 2 || a > 21 || b < 2 || b > 21;
                (layerArray[layerIndex].arr[a][b]).buttonAppearence = null;
                (layerArray[layerIndex].arr[a][b]).transferTool = null;
            }
        }
    }
    makeButton(redLocation, "red");
    makeButton(greenLocation, "green");
    makeButton(blueLocation, "blue");
    makeButton(purpleLocation, "purple");
    makeButton(rainbowLocation, "rainbow");
    makeButton(eraserLocation, "eraser");
    makeTransferTool(bucketCoordinates[0], bucketCoordinates[1], "bucket");
    makeTransferTool(brushCoordinates[0], brushCoordinates[1], "brush");


    for (var layerIndex = 0; layerIndex < layerCount; layerIndex++) {
        for (var a = 0; a < 24; a++) {
            for (var b = 0; b < 24; b++) {
                if (b > 0) {
                    (layerArray[layerIndex].arr[a][b]).left = (layerArray[layerIndex].arr[a][b - 1]);
                }
                if (b < 23) {
                    (layerArray[layerIndex].arr[a][b]).right = (layerArray[layerIndex].arr[a][b + 1]);
                }
                if (a < 23) {
                    (layerArray[layerIndex].arr[a][b]).down = (layerArray[layerIndex].arr[a + 1][b]);
                }
                if (a > 0) {
                    (layerArray[layerIndex].arr[a][b]).up = (layerArray[layerIndex].arr[a - 1][b]);
                }

            }
        }
    }
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
            (screenArray[a][b]).locked = a<2 || a > 21 || b < 2|| b > 21;
            (screenArray[a][b]).buttonAppearence= null;
            (screenArray[a][b]).transferTool = null;
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
function drawToolBar() {
    drawObj('square', 176, 0, "white");
    drawObj('square', 176, 1, "white");
    drawObj('square', 176, 2, "white");
    drawObj('square', 176, 3, "white");
    drawObj('square', 176, 4, "white");
    drawObj('square', 176, 5, "white");
    drawObj('square', 176, 6, "white");
    drawObj('square', 176, 7, "white");
    drawObj('square', 176, 8, "white");
    drawObj('square', 176, 9, "white");
    drawObj('square', 176, 10, "white");
    drawObj('square', 176, 11, "white");
    drawObj('square', 176, 12, "white");
    drawObj('square', 176, 13, "white");
    drawObj('square', 176, 14, "white");
    drawObj('square', 176, 15, "white");
    drawObj('square', 176, 16, "white");
    drawObj('square', 176, 17, "white");
    drawObj('square', 176, 18, "white");
    drawObj('square', 176, 19, "white");
    drawObj('square', 176, 20, "white");
    drawObj('square', 176, 21, "white");
    drawObj('square', 176, 22, "white");
    drawObj('square', 176, 23, "white");
    drawObj('square', 176, 24, "white");
    drawObj('square', 176, 25, "white");
    drawObj('square', 176, 26, "white");
    drawObj('square', 176, 27, "white");
    drawObj('square', 176, 28, "white");
    drawObj('square', 176, 29, "white");
    drawObj('square', 176, 30, "white");
    drawObj('square', 176, 31, "white");
    drawObj('square', 176, 32, "white");
    drawObj('square', 176, 33, "white");
    drawObj('square', 176, 34, "white");
    drawObj('square', 176, 35, "white");
    drawObj('square', 176, 36, "white");
    drawObj('square', 176, 37, "white");
    drawObj('square', 176, 38, "white");
    drawObj('square', 176, 39, "white");
    drawObj('square', 176, 40, "white");
    drawObj('square', 176, 41, "white");
    drawObj('square', 176, 42, "white");
    drawObj('square', 176, 43, "white");
    drawObj('square', 176, 44, "white");
    drawObj('square', 176, 45, "white");
    drawObj('square', 176, 46, "white");
    drawObj('square', 176, 47, "white");
    drawObj('square', 176, 48, "white");
    drawObj('square', 176, 49, "white");
    drawObj('square', 176, 50, "white");
    drawObj('square', 176, 51, "white");
    drawObj('square', 176, 52, "white");
    drawObj('square', 176, 53, "white");
    drawObj('square', 176, 54, "white");
    drawObj('square', 176, 55, "white");
    drawObj('square', 176, 56, "white");
    drawObj('square', 176, 57, "white");
    drawObj('square', 176, 58, "white");
    drawObj('square', 176, 59, "white");
    drawObj('square', 176, 60, "white");
    drawObj('square', 176, 61, "white");
    drawObj('square', 176, 62, "white");
    drawObj('square', 176, 63, "white");
    drawObj('square', 176, 64, "white");
    drawObj('square', 176, 65, "white");
    drawObj('square', 176, 66, "white");
    drawObj('square', 176, 67, "white");
    drawObj('square', 176, 68, "white");
    drawObj('square', 176, 69, "white");
    drawObj('square', 176, 70, "white");
    drawObj('square', 176, 71, "white");
    drawObj('square', 176, 72, "white");
    drawObj('square', 176, 73, "white");
    drawObj('square', 176, 74, "white");
    drawObj('square', 176, 75, "white");
    drawObj('square', 176, 76, "white");
    drawObj('square', 176, 77, "white");
    drawObj('square', 176, 78, "white");
    drawObj('square', 176, 79, "white");
    drawObj('square', 176, 80, "white");
    drawObj('square', 176, 81, "white");
    drawObj('square', 176, 82, "white");
    drawObj('square', 176, 83, "white");
    drawObj('square', 176, 84, "white");
    drawObj('square', 176, 85, "white");
    drawObj('square', 176, 86, "white");
    drawObj('square', 176, 87, "white");
    drawObj('square', 176, 88, "white");
    drawObj('square', 176, 89, "white");
    drawObj('square', 176, 90, "white");
    drawObj('square', 176, 91, "white");
    drawObj('square', 176, 92, "white");
    drawObj('square', 176, 93, "white");
    drawObj('square', 176, 94, "white");
    drawObj('square', 176, 95, "white");
    drawObj('square', 176, 96, "white");
    drawObj('square', 176, 97, "white");
    drawObj('square', 176, 98, "white");
    drawObj('square', 176, 99, "white");
    drawObj('square', 176, 100, "white");
    drawObj('square', 176, 101, "white");
    drawObj('square', 176, 102, "white");
    drawObj('square', 176, 103, "white");
    drawObj('square', 176, 104, "white");
    drawObj('square', 176, 105, "white");
    drawObj('square', 176, 106, "white");
    drawObj('square', 176, 107, "white");
    drawObj('square', 176, 108, "white");
    drawObj('square', 176, 109, "white");
    drawObj('square', 176, 110, "white");
    drawObj('square', 176, 111, "white");
    drawObj('square', 176, 112, "white");
    drawObj('square', 176, 113, "white");
    drawObj('square', 176, 114, "white");
    drawObj('square', 176, 115, "white");
    drawObj('square', 176, 116, "white");
    drawObj('square', 176, 117, "white");
    drawObj('square', 176, 118, "white");
    drawObj('square', 176, 119, "white");
    drawObj('square', 176, 120, "white");
    drawObj('square', 176, 121, "white");
    drawObj('square', 176, 122, "white");
    drawObj('square', 176, 123, "white");
    drawObj('square', 176, 124, "white");
    drawObj('square', 176, 125, "white");
    drawObj('square', 176, 126, "white");
    drawObj('square', 176, 127, "white");
    drawObj('square', 176, 128, "white");
    drawObj('square', 176, 129, "white");
    drawObj('square', 176, 130, "white");
    drawObj('square', 176, 131, "white");
    drawObj('square', 176, 132, "white");
    drawObj('square', 176, 133, "white");
    drawObj('square', 176, 134, "white");
    drawObj('square', 176, 135, "white");
    drawObj('square', 176, 136, "white");
    drawObj('square', 176, 137, "white");
    drawObj('square', 176, 138, "white");
    drawObj('square', 176, 139, "white");
    drawObj('square', 176, 140, "white");
    drawObj('square', 176, 141, "white");
    drawObj('square', 176, 142, "white");
    drawObj('square', 176, 143, "white");
    drawObj('square', 176, 144, "white");
    drawObj('square', 176, 145, "white");
    drawObj('square', 176, 146, "white");
    drawObj('square', 176, 147, "white");
    drawObj('square', 176, 148, "white");
    drawObj('square', 176, 149, "white");
    drawObj('square', 176, 150, "white");
    drawObj('square', 176, 151, "white");
    drawObj('square', 176, 152, "white");
    drawObj('square', 176, 153, "white");
    drawObj('square', 176, 154, "white");
    drawObj('square', 176, 155, "white");
    drawObj('square', 176, 156, "white");
    drawObj('square', 176, 157, "white");
    drawObj('square', 176, 158, "white");
    drawObj('square', 176, 159, "white");
    drawObj('square', 176, 160, "white");
    drawObj('square', 176, 161, "white");
    drawObj('square', 176, 162, "white");
    drawObj('square', 176, 163, "white");
    drawObj('square', 176, 164, "white");
    drawObj('square', 176, 165, "white");
    drawObj('square', 176, 166, "white");
    drawObj('square', 176, 167, "white");
    drawObj('square', 176, 168, "white");
    drawObj('square', 176, 169, "white");
    drawObj('square', 176, 170, "white");
    drawObj('square', 176, 171, "white");
    drawObj('square', 176, 172, "white");
    drawObj('square', 176, 173, "white");
    drawObj('square', 176, 174, "white");
    drawObj('square', 176, 175, "white");
    drawObj('square', 176, 176, "white");
    drawObj('square', 176, 177, "white");
    drawObj('square', 176, 178, "white");
    drawObj('square', 176, 179, "white");
    drawObj('square', 176, 180, "white");
    drawObj('square', 176, 181, "white");
    drawObj('square', 176, 182, "white");
    drawObj('square', 176, 183, "white");
    drawObj('square', 176, 184, "white");
    drawObj('square', 176, 185, "white");
    drawObj('square', 176, 186, "white");
    drawObj('square', 176, 187, "white");
    drawObj('square', 176, 188, "white");
    drawObj('square', 176, 189, "white");
    drawObj('square', 176, 190, "white");
    drawObj('square', 176, 191, "white");
    drawObj('square', 177, 0, "white");
    drawObj('square', 177, 16, "white");
    drawObj('square', 177, 31, "white");
    drawObj('square', 177, 40, "white");
    drawObj('square', 177, 55, "white");
    drawObj('square', 177, 64, "white");
    drawObj('square', 177, 79, "white");
    drawObj('square', 177, 88, "white");
    drawObj('square', 177, 103, "white");
    drawObj('square', 177, 112, "white");
    drawObj('square', 177, 113, "red");
    drawObj('square', 177, 114, "red");
    drawObj('square', 177, 125, "red");
    drawObj('square', 177, 126, "red");
    drawObj('square', 177, 127, "white");
    drawObj('square', 177, 136, "white");
    drawObj('square', 177, 143, "red");
    drawObj('square', 177, 144, "red");
    drawObj('square', 177, 151, "white");
    drawObj('square', 177, 160, "white");
    drawObj('square', 177, 167, "red");
    drawObj('square', 177, 168, "red");
    drawObj('square', 177, 175, "white");
    drawObj('square', 177, 191, "white");
    drawObj('square', 178, 0, "white");
    drawObj('square', 178, 16, "white");
    drawObj('square', 178, 18, "red");
    drawObj('square', 178, 19, "red");
    drawObj('square', 178, 31, "white");
    drawObj('square', 178, 40, "white");
    drawObj('square', 178, 46, "red");
    drawObj('square', 178, 47, "red");
    drawObj('square', 178, 48, "red");
    drawObj('square', 178, 49, "red");
    drawObj('square', 178, 55, "white");
    drawObj('square', 178, 64, "white");
    drawObj('square', 178, 71, "red");
    drawObj('square', 178, 79, "white");
    drawObj('square', 178, 88, "white");
    drawObj('square', 178, 96, "red");
    drawObj('square', 178, 103, "white");
    drawObj('square', 178, 112, "white");
    drawObj('square', 178, 113, "red");
    drawObj('square', 178, 114, "red");
    drawObj('square', 178, 115, "red");
    drawObj('square', 178, 124, "red");
    drawObj('square', 178, 125, "red");
    drawObj('square', 178, 126, "red");
    drawObj('square', 178, 127, "white");
    drawObj('square', 178, 136, "white");
    drawObj('square', 178, 143, "red");
    drawObj('square', 178, 144, "red");
    drawObj('square', 178, 151, "white");
    drawObj('square', 178, 160, "white");
    drawObj('square', 178, 167, "red");
    drawObj('square', 178, 168, "red");
    drawObj('square', 178, 175, "white");
    drawObj('square', 178, 191, "white");
    drawObj('square', 179, 0, "white");
    drawObj('square', 179, 16, "white");
    drawObj('square', 179, 18, "red");
    drawObj('square', 179, 19, "red");
    drawObj('square', 179, 20, "red");
    drawObj('square', 179, 31, "white");
    drawObj('square', 179, 40, "white");
    drawObj('square', 179, 45, "red");
    drawObj('square', 179, 46, "red");
    drawObj('square', 179, 47, "red");
    drawObj('square', 179, 48, "red");
    drawObj('square', 179, 55, "white");
    drawObj('square', 179, 64, "white");
    drawObj('square', 179, 70, "red");
    drawObj('square', 179, 71, "red");
    drawObj('square', 179, 79, "white");
    drawObj('square', 179, 88, "white");
    drawObj('square', 179, 96, "red");
    drawObj('square', 179, 97, "red");
    drawObj('square', 179, 103, "white");
    drawObj('square', 179, 112, "white");
    drawObj('square', 179, 114, "red");
    drawObj('square', 179, 115, "red");
    drawObj('square', 179, 116, "red");
    drawObj('square', 179, 123, "red");
    drawObj('square', 179, 124, "red");
    drawObj('square', 179, 125, "red");
    drawObj('square', 179, 127, "white");
    drawObj('square', 179, 136, "white");
    drawObj('square', 179, 143, "red");
    drawObj('square', 179, 144, "red");
    drawObj('square', 179, 151, "white");
    drawObj('square', 179, 160, "white");
    drawObj('square', 179, 167, "red");
    drawObj('square', 179, 168, "red");
    drawObj('square', 179, 175, "white");
    drawObj('square', 179, 191, "white");
    drawObj('square', 180, 0, "white");
    drawObj('square', 180, 16, "white");
    drawObj('square', 180, 18, "red");
    drawObj('square', 180, 19, "red");
    drawObj('square', 180, 20, "red");
    drawObj('square', 180, 21, "red");
    drawObj('square', 180, 31, "white");
    drawObj('square', 180, 40, "white");
    drawObj('square', 180, 45, "blue");
    drawObj('square', 180, 48, "blue");
    drawObj('square', 180, 49, "blue");
    drawObj('square', 180, 50, "blue");
    drawObj('square', 180, 55, "white");
    drawObj('square', 180, 64, "white");
    drawObj('square', 180, 69, "red");
    drawObj('square', 180, 70, "red");
    drawObj('square', 180, 71, "red");
    drawObj('square', 180, 79, "white");
    drawObj('square', 180, 88, "white");
    drawObj('square', 180, 96, "red");
    drawObj('square', 180, 97, "red");
    drawObj('square', 180, 98, "red");
    drawObj('square', 180, 103, "white");
    drawObj('square', 180, 112, "white");
    drawObj('square', 180, 115, "red");
    drawObj('square', 180, 116, "red");
    drawObj('square', 180, 117, "red");
    drawObj('square', 180, 122, "red");
    drawObj('square', 180, 123, "red");
    drawObj('square', 180, 124, "red");
    drawObj('square', 180, 127, "white");
    drawObj('square', 180, 136, "white");
    drawObj('square', 180, 143, "red");
    drawObj('square', 180, 144, "red");
    drawObj('square', 180, 151, "white");
    drawObj('square', 180, 160, "white");
    drawObj('square', 180, 167, "red");
    drawObj('square', 180, 168, "red");
    drawObj('square', 180, 175, "white");
    drawObj('square', 180, 191, "white");
    drawObj('square', 181, 0, "white");
    drawObj('square', 181, 16, "white");
    drawObj('square', 181, 18, "red");
    drawObj('square', 181, 19, "red");
    drawObj('square', 181, 20, "red");
    drawObj('square', 181, 21, "red");
    drawObj('square', 181, 22, "orange");
    drawObj('square', 181, 31, "white");
    drawObj('square', 181, 40, "white");
    drawObj('square', 181, 44, "blue");
    drawObj('square', 181, 45, "blue");
    drawObj('square', 181, 50, "blue");
    drawObj('square', 181, 51, "blue");
    drawObj('square', 181, 52, "blue");
    drawObj('square', 181, 55, "white");
    drawObj('square', 181, 64, "white");
    drawObj('square', 181, 68, "red");
    drawObj('square', 181, 69, "red");
    drawObj('square', 181, 70, "red");
    drawObj('square', 181, 71, "red");
    drawObj('square', 181, 79, "white");
    drawObj('square', 181, 88, "white");
    drawObj('square', 181, 96, "red");
    drawObj('square', 181, 97, "red");
    drawObj('square', 181, 98, "red");
    drawObj('square', 181, 99, "red");
    drawObj('square', 181, 103, "white");
    drawObj('square', 181, 112, "white");
    drawObj('square', 181, 116, "red");
    drawObj('square', 181, 117, "red");
    drawObj('square', 181, 118, "red");
    drawObj('square', 181, 121, "red");
    drawObj('square', 181, 122, "red");
    drawObj('square', 181, 123, "red");
    drawObj('square', 181, 127, "white");
    drawObj('square', 181, 136, "white");
    drawObj('square', 181, 143, "red");
    drawObj('square', 181, 144, "red");
    drawObj('square', 181, 151, "white");
    drawObj('square', 181, 160, "white");
    drawObj('square', 181, 167, "red");
    drawObj('square', 181, 168, "red");
    drawObj('square', 181, 175, "white");
    drawObj('square', 181, 191, "white");
    drawObj('square', 182, 0, "white");
    drawObj('square', 182, 16, "white");
    drawObj('square', 182, 19, "red");
    drawObj('square', 182, 20, "red");
    drawObj('square', 182, 21, "orange");
    drawObj('square', 182, 22, "orange");
    drawObj('square', 182, 23, "orange");
    drawObj('square', 182, 31, "white");
    drawObj('square', 182, 40, "white");
    drawObj('square', 182, 44, "blue");
    drawObj('square', 182, 51, "blue");
    drawObj('square', 182, 52, "blue");
    drawObj('square', 182, 53, "blue");
    drawObj('square', 182, 55, "white");
    drawObj('square', 182, 64, "white");
    drawObj('square', 182, 67, "red");
    drawObj('square', 182, 68, "red");
    drawObj('square', 182, 69, "red");
    drawObj('square', 182, 70, "red");
    drawObj('square', 182, 71, "red");
    drawObj('square', 182, 72, "red");
    drawObj('square', 182, 73, "red");
    drawObj('square', 182, 74, "red");
    drawObj('square', 182, 75, "red");
    drawObj('square', 182, 76, "red");
    drawObj('square', 182, 77, "red");
    drawObj('square', 182, 79, "white");
    drawObj('square', 182, 88, "white");
    drawObj('square', 182, 90, "red");
    drawObj('square', 182, 91, "red");
    drawObj('square', 182, 92, "red");
    drawObj('square', 182, 93, "red");
    drawObj('square', 182, 94, "red");
    drawObj('square', 182, 95, "red");
    drawObj('square', 182, 96, "red");
    drawObj('square', 182, 97, "red");
    drawObj('square', 182, 98, "red");
    drawObj('square', 182, 99, "red");
    drawObj('square', 182, 100, "red");
    drawObj('square', 182, 103, "white");
    drawObj('square', 182, 112, "white");
    drawObj('square', 182, 117, "red");
    drawObj('square', 182, 118, "red");
    drawObj('square', 182, 119, "red");
    drawObj('square', 182, 120, "red");
    drawObj('square', 182, 121, "red");
    drawObj('square', 182, 122, "red");
    drawObj('square', 182, 127, "white");
    drawObj('square', 182, 136, "white");
    drawObj('square', 182, 143, "red");
    drawObj('square', 182, 144, "red");
    drawObj('square', 182, 151, "white");
    drawObj('square', 182, 160, "white");
    drawObj('square', 182, 167, "red");
    drawObj('square', 182, 168, "red");
    drawObj('square', 182, 175, "white");
    drawObj('square', 182, 191, "white");
    drawObj('square', 183, 0, "white");
    drawObj('square', 183, 16, "white");
    drawObj('square', 183, 22, "orange");
    drawObj('square', 183, 23, "orange");
    drawObj('square', 183, 24, "orange");
    drawObj('square', 183, 31, "white");
    drawObj('square', 183, 40, "white");
    drawObj('square', 183, 43, "blue");
    drawObj('square', 183, 44, "blue");
    drawObj('square', 183, 52, "blue");
    drawObj('square', 183, 53, "blue");
    drawObj('square', 183, 55, "white");
    drawObj('square', 183, 64, "white");
    drawObj('square', 183, 66, "red");
    drawObj('square', 183, 67, "red");
    drawObj('square', 183, 68, "red");
    drawObj('square', 183, 69, "red");
    drawObj('square', 183, 70, "red");
    drawObj('square', 183, 71, "red");
    drawObj('square', 183, 72, "red");
    drawObj('square', 183, 73, "red");
    drawObj('square', 183, 74, "red");
    drawObj('square', 183, 75, "red");
    drawObj('square', 183, 76, "red");
    drawObj('square', 183, 77, "red");
    drawObj('square', 183, 79, "white");
    drawObj('square', 183, 88, "white");
    drawObj('square', 183, 90, "red");
    drawObj('square', 183, 91, "red");
    drawObj('square', 183, 92, "red");
    drawObj('square', 183, 93, "red");
    drawObj('square', 183, 94, "red");
    drawObj('square', 183, 95, "red");
    drawObj('square', 183, 96, "red");
    drawObj('square', 183, 97, "red");
    drawObj('square', 183, 98, "red");
    drawObj('square', 183, 99, "red");
    drawObj('square', 183, 100, "red");
    drawObj('square', 183, 101, "red");
    drawObj('square', 183, 103, "white");
    drawObj('square', 183, 112, "white");
    drawObj('square', 183, 118, "red");
    drawObj('square', 183, 119, "red");
    drawObj('square', 183, 120, "red");
    drawObj('square', 183, 121, "red");
    drawObj('square', 183, 127, "white");
    drawObj('square', 183, 136, "white");
    drawObj('square', 183, 137, "red");
    drawObj('square', 183, 138, "red");
    drawObj('square', 183, 139, "red");
    drawObj('square', 183, 140, "red");
    drawObj('square', 183, 141, "red");
    drawObj('square', 183, 142, "red");
    drawObj('square', 183, 143, "red");
    drawObj('square', 183, 144, "red");
    drawObj('square', 183, 145, "red");
    drawObj('square', 183, 146, "red");
    drawObj('square', 183, 147, "red");
    drawObj('square', 183, 148, "red");
    drawObj('square', 183, 149, "red");
    drawObj('square', 183, 150, "red");
    drawObj('square', 183, 151, "white");
    drawObj('square', 183, 160, "white");
    drawObj('square', 183, 167, "red");
    drawObj('square', 183, 168, "red");
    drawObj('square', 183, 175, "white");
    drawObj('square', 183, 191, "white");
    drawObj('square', 184, 0, "white");
    drawObj('square', 184, 16, "white");
    drawObj('square', 184, 23, "orange");
    drawObj('square', 184, 24, "orange");
    drawObj('square', 184, 25, "orange");
    drawObj('square', 184, 31, "white");
    drawObj('square', 184, 40, "white");
    drawObj('square', 184, 43, "blue");
    drawObj('square', 184, 44, "blue");
    drawObj('square', 184, 52, "blue");
    drawObj('square', 184, 55, "white");
    drawObj('square', 184, 64, "white");
    drawObj('square', 184, 66, "red");
    drawObj('square', 184, 67, "red");
    drawObj('square', 184, 68, "red");
    drawObj('square', 184, 69, "red");
    drawObj('square', 184, 70, "red");
    drawObj('square', 184, 71, "red");
    drawObj('square', 184, 72, "red");
    drawObj('square', 184, 73, "red");
    drawObj('square', 184, 74, "red");
    drawObj('square', 184, 75, "red");
    drawObj('square', 184, 76, "red");
    drawObj('square', 184, 77, "red");
    drawObj('square', 184, 79, "white");
    drawObj('square', 184, 88, "white");
    drawObj('square', 184, 90, "red");
    drawObj('square', 184, 91, "red");
    drawObj('square', 184, 92, "red");
    drawObj('square', 184, 93, "red");
    drawObj('square', 184, 94, "red");
    drawObj('square', 184, 95, "red");
    drawObj('square', 184, 96, "red");
    drawObj('square', 184, 97, "red");
    drawObj('square', 184, 98, "red");
    drawObj('square', 184, 99, "red");
    drawObj('square', 184, 100, "red");
    drawObj('square', 184, 101, "red");
    drawObj('square', 184, 103, "white");
    drawObj('square', 184, 112, "white");
    drawObj('square', 184, 118, "red");
    drawObj('square', 184, 119, "red");
    drawObj('square', 184, 120, "red");
    drawObj('square', 184, 121, "red");
    drawObj('square', 184, 127, "white");
    drawObj('square', 184, 136, "white");
    drawObj('square', 184, 137, "red");
    drawObj('square', 184, 138, "red");
    drawObj('square', 184, 139, "red");
    drawObj('square', 184, 140, "red");
    drawObj('square', 184, 141, "red");
    drawObj('square', 184, 142, "red");
    drawObj('square', 184, 143, "red");
    drawObj('square', 184, 144, "red");
    drawObj('square', 184, 145, "red");
    drawObj('square', 184, 146, "red");
    drawObj('square', 184, 147, "red");
    drawObj('square', 184, 148, "red");
    drawObj('square', 184, 149, "red");
    drawObj('square', 184, 150, "red");
    drawObj('square', 184, 151, "white");
    drawObj('square', 184, 160, "white");
    drawObj('square', 184, 167, "red");
    drawObj('square', 184, 168, "red");
    drawObj('square', 184, 175, "white");
    drawObj('square', 184, 191, "white");
    drawObj('square', 185, 0, "white");
    drawObj('square', 185, 16, "white");
    drawObj('square', 185, 24, "orange");
    drawObj('square', 185, 25, "orange");
    drawObj('square', 185, 26, "orange");
    drawObj('square', 185, 27, "orange");
    drawObj('square', 185, 31, "white");
    drawObj('square', 185, 40, "white");
    drawObj('square', 185, 43, "blue");
    drawObj('square', 185, 44, "blue");
    drawObj('square', 185, 52, "blue");
    drawObj('square', 185, 55, "white");
    drawObj('square', 185, 64, "white");
    drawObj('square', 185, 67, "red");
    drawObj('square', 185, 68, "red");
    drawObj('square', 185, 69, "red");
    drawObj('square', 185, 70, "red");
    drawObj('square', 185, 71, "red");
    drawObj('square', 185, 72, "red");
    drawObj('square', 185, 73, "red");
    drawObj('square', 185, 74, "red");
    drawObj('square', 185, 75, "red");
    drawObj('square', 185, 76, "red");
    drawObj('square', 185, 77, "red");
    drawObj('square', 185, 79, "white");
    drawObj('square', 185, 88, "white");
    drawObj('square', 185, 90, "red");
    drawObj('square', 185, 91, "red");
    drawObj('square', 185, 92, "red");
    drawObj('square', 185, 93, "red");
    drawObj('square', 185, 94, "red");
    drawObj('square', 185, 95, "red");
    drawObj('square', 185, 96, "red");
    drawObj('square', 185, 97, "red");
    drawObj('square', 185, 98, "red");
    drawObj('square', 185, 99, "red");
    drawObj('square', 185, 100, "red");
    drawObj('square', 185, 103, "white");
    drawObj('square', 185, 112, "white");
    drawObj('square', 185, 117, "red");
    drawObj('square', 185, 118, "red");
    drawObj('square', 185, 119, "red");
    drawObj('square', 185, 120, "red");
    drawObj('square', 185, 121, "red");
    drawObj('square', 185, 122, "red");
    drawObj('square', 185, 127, "white");
    drawObj('square', 185, 136, "white");
    drawObj('square', 185, 143, "red");
    drawObj('square', 185, 144, "red");
    drawObj('square', 185, 151, "white");
    drawObj('square', 185, 160, "white");
    drawObj('square', 185, 167, "red");
    drawObj('square', 185, 168, "red");
    drawObj('square', 185, 175, "white");
    drawObj('square', 185, 191, "white");
    drawObj('square', 186, 0, "white");
    drawObj('square', 186, 16, "white");
    drawObj('square', 186, 25, "orange");
    drawObj('square', 186, 26, "orange");
    drawObj('square', 186, 27, "orange");
    drawObj('square', 186, 28, "orange");
    drawObj('square', 186, 31, "white");
    drawObj('square', 186, 40, "white");
    drawObj('square', 186, 44, "blue");
    drawObj('square', 186, 45, "blue");
    drawObj('square', 186, 51, "blue");
    drawObj('square', 186, 52, "blue");
    drawObj('square', 186, 55, "white");
    drawObj('square', 186, 64, "white");
    drawObj('square', 186, 68, "red");
    drawObj('square', 186, 69, "red");
    drawObj('square', 186, 70, "red");
    drawObj('square', 186, 71, "red");
    drawObj('square', 186, 79, "white");
    drawObj('square', 186, 88, "white");
    drawObj('square', 186, 96, "red");
    drawObj('square', 186, 97, "red");
    drawObj('square', 186, 98, "red");
    drawObj('square', 186, 99, "red");
    drawObj('square', 186, 103, "white");
    drawObj('square', 186, 112, "white");
    drawObj('square', 186, 116, "red");
    drawObj('square', 186, 117, "red");
    drawObj('square', 186, 118, "red");
    drawObj('square', 186, 121, "red");
    drawObj('square', 186, 122, "red");
    drawObj('square', 186, 123, "red");
    drawObj('square', 186, 127, "white");
    drawObj('square', 186, 136, "white");
    drawObj('square', 186, 143, "red");
    drawObj('square', 186, 144, "red");
    drawObj('square', 186, 151, "white");
    drawObj('square', 186, 160, "white");
    drawObj('square', 186, 167, "red");
    drawObj('square', 186, 168, "red");
    drawObj('square', 186, 175, "white");
    drawObj('square', 186, 191, "white");
    drawObj('square', 187, 0, "white");
    drawObj('square', 187, 16, "white");
    drawObj('square', 187, 26, "orange");
    drawObj('square', 187, 27, "orange");
    drawObj('square', 187, 28, "orange");
    drawObj('square', 187, 29, "orange");
    drawObj('square', 187, 31, "white");
    drawObj('square', 187, 40, "white");
    drawObj('square', 187, 46, "blue");
    drawObj('square', 187, 47, "blue");
    drawObj('square', 187, 50, "blue");
    drawObj('square', 187, 51, "blue");
    drawObj('square', 187, 55, "white");
    drawObj('square', 187, 64, "white");
    drawObj('square', 187, 69, "red");
    drawObj('square', 187, 70, "red");
    drawObj('square', 187, 71, "red");
    drawObj('square', 187, 79, "white");
    drawObj('square', 187, 88, "white");
    drawObj('square', 187, 96, "red");
    drawObj('square', 187, 97, "red");
    drawObj('square', 187, 98, "red");
    drawObj('square', 187, 103, "white");
    drawObj('square', 187, 112, "white");
    drawObj('square', 187, 115, "red");
    drawObj('square', 187, 116, "red");
    drawObj('square', 187, 117, "red");
    drawObj('square', 187, 122, "red");
    drawObj('square', 187, 123, "red");
    drawObj('square', 187, 124, "red");
    drawObj('square', 187, 127, "white");
    drawObj('square', 187, 136, "white");
    drawObj('square', 187, 143, "red");
    drawObj('square', 187, 144, "red");
    drawObj('square', 187, 151, "white");
    drawObj('square', 187, 160, "white");
    drawObj('square', 187, 167, "red");
    drawObj('square', 187, 168, "red");
    drawObj('square', 187, 175, "white");
    drawObj('square', 187, 191, "white");
    drawObj('square', 188, 0, "white");
    drawObj('square', 188, 16, "white");
    drawObj('square', 188, 28, "orange");
    drawObj('square', 188, 29, "orange");
    drawObj('square', 188, 31, "white");
    drawObj('square', 188, 40, "white");
    drawObj('square', 188, 48, "blue");
    drawObj('square', 188, 49, "blue");
    drawObj('square', 188, 50, "blue");
    drawObj('square', 188, 51, "blue");
    drawObj('square', 188, 55, "white");
    drawObj('square', 188, 64, "white");
    drawObj('square', 188, 70, "red");
    drawObj('square', 188, 71, "red");
    drawObj('square', 188, 79, "white");
    drawObj('square', 188, 88, "white");
    drawObj('square', 188, 96, "red");
    drawObj('square', 188, 97, "red");
    drawObj('square', 188, 103, "white");
    drawObj('square', 188, 112, "white");
    drawObj('square', 188, 114, "red");
    drawObj('square', 188, 115, "red");
    drawObj('square', 188, 116, "red");
    drawObj('square', 188, 123, "red");
    drawObj('square', 188, 124, "red");
    drawObj('square', 188, 125, "red");
    drawObj('square', 188, 127, "white");
    drawObj('square', 188, 136, "white");
    drawObj('square', 188, 143, "red");
    drawObj('square', 188, 144, "red");
    drawObj('square', 188, 151, "white");
    drawObj('square', 188, 160, "white");
    drawObj('square', 188, 167, "red");
    drawObj('square', 188, 168, "red");
    drawObj('square', 188, 175, "white");
    drawObj('square', 188, 191, "white");
    drawObj('square', 189, 0, "white");
    drawObj('square', 189, 16, "white");
    drawObj('square', 189, 29, "orange");
    drawObj('square', 189, 30, "orange");
    drawObj('square', 189, 31, "white");
    drawObj('square', 189, 40, "white");
    drawObj('square', 189, 55, "white");
    drawObj('square', 189, 64, "white");
    drawObj('square', 189, 71, "red");
    drawObj('square', 189, 79, "white");
    drawObj('square', 189, 88, "white");
    drawObj('square', 189, 96, "red");
    drawObj('square', 189, 103, "white");
    drawObj('square', 189, 112, "white");
    drawObj('square', 189, 113, "red");
    drawObj('square', 189, 114, "red");
    drawObj('square', 189, 115, "red");
    drawObj('square', 189, 124, "red");
    drawObj('square', 189, 125, "red");
    drawObj('square', 189, 126, "red");
    drawObj('square', 189, 127, "white");
    drawObj('square', 189, 136, "white");
    drawObj('square', 189, 143, "red");
    drawObj('square', 189, 144, "red");
    drawObj('square', 189, 151, "white");
    drawObj('square', 189, 160, "white");
    drawObj('square', 189, 167, "red");
    drawObj('square', 189, 168, "red");
    drawObj('square', 189, 175, "white");
    drawObj('square', 189, 191, "white");
    drawObj('square', 190, 0, "white");
    drawObj('square', 190, 16, "white");
    drawObj('square', 190, 30, "orange");
    drawObj('square', 190, 31, "white");
    drawObj('square', 190, 40, "white");
    drawObj('square', 190, 55, "white");
    drawObj('square', 190, 64, "white");
    drawObj('square', 190, 79, "white");
    drawObj('square', 190, 88, "white");
    drawObj('square', 190, 103, "white");
    drawObj('square', 190, 112, "white");
    drawObj('square', 190, 113, "red");
    drawObj('square', 190, 114, "red");
    drawObj('square', 190, 125, "red");
    drawObj('square', 190, 126, "red");
    drawObj('square', 190, 127, "white");
    drawObj('square', 190, 136, "white");
    drawObj('square', 190, 143, "red");
    drawObj('square', 190, 144, "red");
    drawObj('square', 190, 151, "white");
    drawObj('square', 190, 160, "white");
    drawObj('square', 190, 167, "red");
    drawObj('square', 190, 168, "red");
    drawObj('square', 190, 175, "white");
    drawObj('square', 190, 191, "white");
    drawObj('square', 191, 0, "white");
    drawObj('square', 191, 1, "white");
    drawObj('square', 191, 2, "white");
    drawObj('square', 191, 3, "white");
    drawObj('square', 191, 4, "white");
    drawObj('square', 191, 5, "white");
    drawObj('square', 191, 6, "white");
    drawObj('square', 191, 7, "white");
    drawObj('square', 191, 8, "white");
    drawObj('square', 191, 9, "white");
    drawObj('square', 191, 10, "white");
    drawObj('square', 191, 11, "white");
    drawObj('square', 191, 12, "white");
    drawObj('square', 191, 13, "white");
    drawObj('square', 191, 14, "white");
    drawObj('square', 191, 15, "white");
    drawObj('square', 191, 16, "white");
    drawObj('square', 191, 17, "white");
    drawObj('square', 191, 18, "white");
    drawObj('square', 191, 19, "white");
    drawObj('square', 191, 20, "white");
    drawObj('square', 191, 21, "white");
    drawObj('square', 191, 22, "white");
    drawObj('square', 191, 23, "white");
    drawObj('square', 191, 24, "white");
    drawObj('square', 191, 25, "white");
    drawObj('square', 191, 26, "white");
    drawObj('square', 191, 27, "white");
    drawObj('square', 191, 28, "white");
    drawObj('square', 191, 29, "white");
    drawObj('square', 191, 30, "white");
    drawObj('square', 191, 31, "white");
    drawObj('square', 191, 32, "white");
    drawObj('square', 191, 33, "white");
    drawObj('square', 191, 34, "white");
    drawObj('square', 191, 35, "white");
    drawObj('square', 191, 36, "white");
    drawObj('square', 191, 37, "white");
    drawObj('square', 191, 38, "white");
    drawObj('square', 191, 39, "white");
    drawObj('square', 191, 40, "white");
    drawObj('square', 191, 41, "white");
    drawObj('square', 191, 42, "white");
    drawObj('square', 191, 43, "white");
    drawObj('square', 191, 44, "white");
    drawObj('square', 191, 45, "white");
    drawObj('square', 191, 46, "white");
    drawObj('square', 191, 47, "white");
    drawObj('square', 191, 48, "white");
    drawObj('square', 191, 49, "white");
    drawObj('square', 191, 50, "white");
    drawObj('square', 191, 51, "white");
    drawObj('square', 191, 52, "white");
    drawObj('square', 191, 53, "white");
    drawObj('square', 191, 54, "white");
    drawObj('square', 191, 55, "white");
    drawObj('square', 191, 56, "white");
    drawObj('square', 191, 57, "white");
    drawObj('square', 191, 58, "white");
    drawObj('square', 191, 59, "white");
    drawObj('square', 191, 60, "white");
    drawObj('square', 191, 61, "white");
    drawObj('square', 191, 62, "white");
    drawObj('square', 191, 63, "white");
    drawObj('square', 191, 64, "white");
    drawObj('square', 191, 65, "white");
    drawObj('square', 191, 66, "white");
    drawObj('square', 191, 67, "white");
    drawObj('square', 191, 68, "white");
    drawObj('square', 191, 69, "white");
    drawObj('square', 191, 70, "white");
    drawObj('square', 191, 71, "white");
    drawObj('square', 191, 72, "white");
    drawObj('square', 191, 73, "white");
    drawObj('square', 191, 74, "white");
    drawObj('square', 191, 75, "white");
    drawObj('square', 191, 76, "white");
    drawObj('square', 191, 77, "white");
    drawObj('square', 191, 78, "white");
    drawObj('square', 191, 79, "white");
    drawObj('square', 191, 80, "white");
    drawObj('square', 191, 81, "white");
    drawObj('square', 191, 82, "white");
    drawObj('square', 191, 83, "white");
    drawObj('square', 191, 84, "white");
    drawObj('square', 191, 85, "white");
    drawObj('square', 191, 86, "white");
    drawObj('square', 191, 87, "white");
    drawObj('square', 191, 88, "white");
    drawObj('square', 191, 89, "white");
    drawObj('square', 191, 90, "white");
    drawObj('square', 191, 91, "white");
    drawObj('square', 191, 92, "white");
    drawObj('square', 191, 93, "white");
    drawObj('square', 191, 94, "white");
    drawObj('square', 191, 95, "white");
    drawObj('square', 191, 96, "white");
    drawObj('square', 191, 97, "white");
    drawObj('square', 191, 98, "white");
    drawObj('square', 191, 99, "white");
    drawObj('square', 191, 100, "white");
    drawObj('square', 191, 101, "white");
    drawObj('square', 191, 102, "white");
    drawObj('square', 191, 103, "white");
    drawObj('square', 191, 104, "white");
    drawObj('square', 191, 105, "white");
    drawObj('square', 191, 106, "white");
    drawObj('square', 191, 107, "white");
    drawObj('square', 191, 108, "white");
    drawObj('square', 191, 109, "white");
    drawObj('square', 191, 110, "white");
    drawObj('square', 191, 111, "white");
    drawObj('square', 191, 112, "white");
    drawObj('square', 191, 113, "white");
    drawObj('square', 191, 114, "white");
    drawObj('square', 191, 115, "white");
    drawObj('square', 191, 116, "white");
    drawObj('square', 191, 117, "white");
    drawObj('square', 191, 118, "white");
    drawObj('square', 191, 119, "white");
    drawObj('square', 191, 120, "white");
    drawObj('square', 191, 121, "white");
    drawObj('square', 191, 122, "white");
    drawObj('square', 191, 123, "white");
    drawObj('square', 191, 124, "white");
    drawObj('square', 191, 125, "white");
    drawObj('square', 191, 126, "white");
    drawObj('square', 191, 127, "white");
    drawObj('square', 191, 128, "white");
    drawObj('square', 191, 129, "white");
    drawObj('square', 191, 130, "white");
    drawObj('square', 191, 131, "white");
    drawObj('square', 191, 132, "white");
    drawObj('square', 191, 133, "white");
    drawObj('square', 191, 134, "white");
    drawObj('square', 191, 135, "white");
    drawObj('square', 191, 136, "white");
    drawObj('square', 191, 137, "white");
    drawObj('square', 191, 138, "white");
    drawObj('square', 191, 139, "white");
    drawObj('square', 191, 140, "white");
    drawObj('square', 191, 141, "white");
    drawObj('square', 191, 142, "white");
    drawObj('square', 191, 143, "white");
    drawObj('square', 191, 144, "white");
    drawObj('square', 191, 145, "white");
    drawObj('square', 191, 146, "white");
    drawObj('square', 191, 147, "white");
    drawObj('square', 191, 148, "white");
    drawObj('square', 191, 149, "white");
    drawObj('square', 191, 150, "white");
    drawObj('square', 191, 151, "white");
    drawObj('square', 191, 152, "white");
    drawObj('square', 191, 153, "white");
    drawObj('square', 191, 154, "white");
    drawObj('square', 191, 155, "white");
    drawObj('square', 191, 156, "white");
    drawObj('square', 191, 157, "white");
    drawObj('square', 191, 158, "white");
    drawObj('square', 191, 159, "white");
    drawObj('square', 191, 160, "white");
    drawObj('square', 191, 161, "white");
    drawObj('square', 191, 162, "white");
    drawObj('square', 191, 163, "white");
    drawObj('square', 191, 164, "white");
    drawObj('square', 191, 165, "white");
    drawObj('square', 191, 166, "white");
    drawObj('square', 191, 167, "white");
    drawObj('square', 191, 168, "white");
    drawObj('square', 191, 169, "white");
    drawObj('square', 191, 170, "white");
    drawObj('square', 191, 171, "white");
    drawObj('square', 191, 172, "white");
    drawObj('square', 191, 173, "white");
    drawObj('square', 191, 174, "white");
    drawObj('square', 191, 175, "white");
    drawObj('square', 191, 176, "white");
    drawObj('square', 191, 177, "white");
    drawObj('square', 191, 178, "white");
    drawObj('square', 191, 179, "white");
    drawObj('square', 191, 180, "white");
    drawObj('square', 191, 181, "white");
    drawObj('square', 191, 182, "white");
    drawObj('square', 191, 183, "white");
    drawObj('square', 191, 184, "white");
    drawObj('square', 191, 185, "white");
    drawObj('square', 191, 186, "white");
    drawObj('square', 191, 187, "white");
    drawObj('square', 191, 188, "white");
    drawObj('square', 191, 189, "white");
    drawObj('square', 191, 190, "white");
    drawObj('square', 191, 191, "white");

}

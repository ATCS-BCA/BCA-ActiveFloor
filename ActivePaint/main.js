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
                if(layerArray[currentLayer].arr[i][p].locked && !occupied){
                    layerArray[currentLayer].arr[i][p].hold=true;
                    occupied = true;
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
                occupied=false;
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
            if ((layerArray[currentLayer].arr[i][p]).value && !layerArray[currentLayer].arr[i][p].locked) {
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
            drawToolBar();
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

/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;
var shapes = [];
var visible = [[false, false, false, false],
    [false, false, false, false],
    [false, false, false, false],
    [false, false, false, false]
];

function drawObj(xPos, yPos, size, numShape, canSee) {
    'use strict';

    context2D.fillStyle = 'red';
    context2D.fillRect(xPos, yPos, size, size);

    if (canSee) {
        drawShape(xPos, yPos, size, numShape, canSee);
    }
}

function drawShape(xPos, yPos, size, numShape, canSee) {

    var xPos2 = xPos + 3;
    var yPos2 = yPos + 3;
    var size2 = size - 6;

        switch (numShape) {
            case 0:
                context2D.fillStyle = 'black';
                context2D.fillRect(xPos2, yPos2, size2, size2);
                break;
            case 1:
                context2D.fillStyle = 'yellow';
                context2D.fillRect(xPos2, yPos2, size2, size2);
                break;
            case 2:
                context2D.fillStyle = 'green';
                context2D.fillRect(xPos2, yPos2, size2, size2);
                break;
            case 3:
                context2D.fillStyle = 'purple';
                context2D.fillRect(xPos2, yPos2, size2, size2);
                break;
            case 4:
                context2D.fillStyle = 'orange';
                context2D.fillRect(xPos2, yPos2, size2, size2);
                break;
            case 5:
                context2D.fillStyle = 'pink';
                context2D.fillRect(xPos2, yPos2, size2, size2);
                break;
            case 6:
                context2D.fillStyle = 'blue';
                context2D.fillRect(xPos2, yPos2, size2, size2);
                break;
            case 7:
                context2D.fillStyle = 'grey';
                context2D.fillRect(xPos2, yPos2, size2, size2);
                break;
            default:
                break;

        }
    canSee = false;
    setTimeout(drawObj, 3000);

}

function drawCanvas(arr) {
    'use strict';
    canvas = document.getElementById('floorCanvas');
    canvas.width = ledsX;
    canvas.height = ledsY;
    context2D = canvas.getContext('2d');

    var i, tempRow, j, tempX, tempY;
    for (i = 0; i < shapes.length; i += 1) {
        tempRow = shapes[i];

        for (j = 0; j < tempRow.length; j += 1) {

            tempX = j * ledPerSensorX * 6;
            tempY = i * ledPerSensorY * 6;
            var shapeArrayIndexValue = shapes[i][j];
            drawObj(tempX, tempY, 4 * ledPerSensorX, shapeArrayIndexValue, visible[i][j]);
        }
    }
}


function refreshXML() {
    'use strict';
    $.get('http://10.31.33.66:8080/', function (data) {
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

        drawCanvas(dataHolderArray);

        for(var i = 0; i < sensorsX; i++) {
            for(var j = 0; j < sensorsY; j++) {
                if(dataHolderArray[i][j] === charSearch) {
                    var k = Math.floor(i/6);
                    var t = Math.floor(j/6);
                    visible[k][t] = true;

                }
            }
        }
    });
}

$(document).ready(function () {
    'use strict';

    // Start getting floor data automatically (assuming Floor Server is running).
    startRefresh();

    sendSemaphore(function () {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");

    });

    var numArry1 = [
        0, 0, 1, 1,
        2, 2, 3, 3,
        4, 4, 5, 5,
        6, 6, 7, 7
    ];


    shuffle(numArry1);

    shapes = [
        [numArry1[0], numArry1[1], numArry1[2], numArry1[3]],
        [numArry1[4], numArry1[5], numArry1[6], numArry1[7]],
        [numArry1[8], numArry1[9], numArry1[10], numArry1[11]],
        [numArry1[12], numArry1[13], numArry1[14], numArry1[15]]
    ];


});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {
        refreshXML();
    }, refreshTime);
}

function stopRefresh() {
    'use strict';
    clearInterval(myInterval);
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;

}
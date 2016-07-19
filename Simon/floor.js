/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;

function refreshXML() {
    'use strict';
    // change IP address to match ActiveFloor server address
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
        //DIFFERENT FROM SP (SP HAS LINE: moveStart = 0;)
        drawCanvas(dataHolderArray);
    });
}

// restart the game? when active is false
function refresh() {
    // active is like when on/off... right now, "false" is off. so when active == false,
    if (active == false) {
        // there is a variable that creates an element "a"
        var a = document.createElement('a');
        a.id="restart";
        a.title = "Restart";
        a.href = "tictactoe.html";
        document.body.appendChild(a);

        document.getElementById('restart').click();
        done=false;
    }
}

// put in an array "arr" to draw canvas
function drawCanvas(arr) {
    'use strict';
    // variable "middle" starting at 0
    var middle=0;

    // first, for every variable "i" going from 0 to the length of the array,
    for (var i=0;i<arr.length;i++) {
        // there's another variable "j" going from 0 to the same length of the array
        for (var j=0;j<arr[i].length;j++) {

            // row "i", column "j"... if there is someone stepping there,
            if (arr[i][j]==="*") {
                // if it's in the middle box, then add 1 to "middle"
                if (i>=8 && i<=16 && j>=8 && j<=16) middle++;
                // method "press" in TTTfloor.js, "Math.floor()" function returns the largest integer less than or equal to a given number
                // for example, if (8, 8) is stepped on, then press (1, 1)
                // for example, if (15, 15) is stepped on, then press (1, 1)
                // for example, if (16, 16) is stepped on, then press (2, 2)
                press(Math.floor(i/8),Math.floor(j/8));
            }
        }
    }

    // NOT SURE WHAT THIS MEAN?
    if (middle>2) refresh();
}

function Restart(){
    done=true;
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
    myInterval = setInterval(function () {refreshXML(); }, refreshTime);
}

function stopRefresh() {
    'use strict';
    clearInterval(myInterval);
}

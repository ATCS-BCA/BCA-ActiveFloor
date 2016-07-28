/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 80;
var highscore = 0;
done=false;
canType=true;

function Restart(){
    done=true;
}

function refresh(){
    if(active == false){
        var a = document.createElement('a');
        a.id="restart";
        a.title = "Restart";
        a.href = "index.html";
        document.body.appendChild(a);
        

        document.getElementById('restart').click();
        done=false;

    }
}
var timer = 0;
function initCanvas(arr) {
    if (timer <= 0) {
        timer = 0;
        window.setTimeout(initCanvas, 5000);
        'use strict';
        var up = 0;
        var down = 0;
        var left = 0;
        var right = 0;
        var middle = 0;

        var letterCounts = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        var letter;

        for (var i = 14; i <= 18; i++) {
            for (var j = 12; j < 14; j++) {

                if (arr[i][j] === "*") {
                    timer = 250;
                    keyPress('left');
                }
            }
        }

        for (var i = 14; i <= 18; i++) {
            for (var j = 21; j < 23; j++) {

                if (arr[i][j] === "*") {
                    timer = 250;
                    keyPress('right');
                }
            }
        }

        for (var i = 9; i <= 13; i++) {
            for (var j = 16; j < 21; j++) {

                if (arr[i][j] === "*") {
                    timer = 3500;
                    keyPress('rotate');

                }
            }
        }

        for (var i = 20; i <= 23; i++) {
            for (var j = 16; j < 21; j++) {

                if (arr[i][j] === "*") {
                    timer = 50;
                    keyPress('down');
                }
            }
        }

        //console.log(letterCounts);
        var max = 0;
        for (var i = 1; i < letterCounts.length; i++) {
            if (letterCounts[i] > letterCounts[max]) {
                max = i;
            }
        }

        if (canType && highscore) {
            switch (max) {
                case 26:
                    rem();
                    break;
                case 27:
                    done();
                    break;
                default:
                    if (letterCounts[max] > 0) {
                        type(65 + max);
                    }
            }
            canType = false;
            setTimeout(function () {
                canType = true;
            }, 500);
        }

        if (done && !highscore) {
            if (middle > 2) refresh();
        }

        var winner = Math.max(up, down, left, right);
        var key;
        if (winner > 1) {
            switch (winner) {
                case 0:
                    key = -1;
                    break;
                case up:
                    key = 38;
                    break;
                case down:
                    key = 40;
                    break;
                case left:
                    key = 37;
                    break;
                case right:
                    key = 39;
                    break;
            }
        }

        // if (key!=-1)
        //     press(key);
        //console.log(key);
    }
    timer =- 1;
}

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
			
        initCanvas(dataHolderArray);
    });
}

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {refreshXML(); }, refreshTime);

    setInterval( render, 30 );

}

$(document).ready(function () {
    'use strict';
    canvas = document.getElementsByTagName( 'canvas' )[ 0 ];
    ctx = canvas.getContext( '2d' );
    newGame();

    startRefresh();
    
    sendSemaphore(function() {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");
    });
});
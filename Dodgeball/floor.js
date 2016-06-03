/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var firstTime = true;
var refreshTime = 80;
var noTouch = true;

function initCanvas(arr) {
    'use strict';
    canvas = document.getElementById('floorCanvas');
    canvas.width = ledsX;
    canvas.height = ledsY;
    context2D = canvas.getContext('2d');

    
    var i, tempRow, p, srchStr, tempX, tempY;
    
    if (game == true){
        for (i = 0; i < arr.length; i += 1) {
            tempRow = arr[i];
            
            for (p = 0; p < tempRow.length; p += 1) {
                srchStr = tempRow.substring(p, p + 1);
                if (srchStr === charSearch) {
                    tempX = p * ledPerSensorX;
                    tempY = i * ledPerSensorY;
                    hit(tempX, tempY);
                    noTouch = false;
                }
            }
        }
        if (noTouch)
            active = false;
    } else {
        for (i = 0; i < arr.length; i += 1) {
            tempRow = arr[i];
            
            for (p = 0; p < tempRow.length; p += 1) {
                srchStr = tempRow.substring(p, p + 1);
                if (srchStr === charSearch) {
                    tempX = p * ledPerSensorX;
                    tempY = i * ledPerSensorY;
                    if(startX <= tempX && tempX <= startX + startW && startY <= tempY 
                        && tempY <= startY + startH) {
                        game = true;
                    }
                }
            }
        }
    }
    
}

function refreshXML() {
    'use strict';
	// change IP address to match ActiveFloor server address
    $.get('http://10.31.34.74:8080/', function (data) {
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
        if (firstTime == true){
            firstTime = false;
            menu();
        }
    });
}

$(document).ready(function () {
    'use strict';
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


/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 80;

function refresh(){
    var a = document.createElement('a');
    a.id="restart";
    a.href = "pong.html";
    document.body.appendChild(a);


    document.getElementById('restart').click();
}

function initCanvas(arr) {
    'use strict';
    var left1=0;
    var right1=0;
    var left2=0;
    var right2=0;
    var middle=0;

    for (var i=0;i<arr.length;i++){
        for (var j=0;j<arr[i].length;j++){

            if (arr[i][j]==="*"){
                if (i>=8 && i<=16 && j>=8 && j<=16){
                    middle++;
                }else{
                    if (i>=4 && i<=8){
                        if (j>=4 && j<=8) left1++;
                        if (j>=16 && j<=20) right1++;
                    }

                    if (i>=16 && i<=20){
                        if (j>=4 && j<=8) left2++;
                        if (j>=16 && j<=20) right2++;
                    }
                }
                
            }
        }
    }
    if (middle>6) refresh();

    var winner1=-1;
    if (Math.abs(left1-right1)>=1){
        if (left1>right1) winner1=0;
        else winner1=1;
    }

    var winner2=-1;
    if (Math.abs(left2-right2)>=1){
        if (left2>right2) winner2=0;
        else winner2=1;
    }

    console.log(winner1+", "+winner2);
//    console.log(left1+", "+right1+", "+left2+", "+right2);
    press(winner2,winner1);
}

function refreshXML() {
    'use strict';
    // change IP address to match ActiveFloor server address
    $.get('http://activefloor.bca.bergen.org:8080/', function (data) {
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

$(document).ready(function () {
    'use strict';
    startRefresh();
});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {refreshXML(); }, refreshTime);
}

$(document).ready(function () {
    'use strict';
    startRefresh();
    
    sendSemaphore(function() {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
//        $("#floorCanvas").addClass("app");
        
    });
});
/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 1000/60;

function refresh(){
    if(active == false){
        var a = document.createElement('a');
        a.id="restart";
        a.title = "Restart";
        a.href = "lightsout.html";
        document.body.appendChild(a);
        

        document.getElementById('restart').click();
        done=false;

    }
}

function initCanvas(arr) {
    'use strict';
    var middle=0;

    var presses = new Array(5);
    for (var i = 0; i < presses.length; i++) {
        presses[i] = [0,0,0,0,0];
    }


    for (var i=0;i<arr.length;i++){
        for (var j=0;j<arr[i].length;j++){

            if (arr[i][j]==="*"){
                if (i>=2 && i<=21 && j>=2 && j<=21){
                    presses[Math.floor((i-2)/4)][Math.floor((j-2)/4)]++;
                }
            }
        }
    }

    var winnerX=-1;
    var winnerY=-1;
    for (var i=0;i<presses.length;i++){
        for (var j=0;j<presses[i].length;j++){
            if ( !(winnerX==-1 && presses[i][j]==0) && ((winnerX==-1 && presses[i][j]>0) || presses[i][j]>presses[winnerX][winnerY])){
                winnerX=i;
                winnerY=j;
            }
        }   
    }
    if (winnerX!=-1)
        press(winnerY,winnerX);

    if (middle>2) refresh();

}

function refreshXML() {
    'use strict';
	// change IP address to match ActiveFloor server address
    $.get('http://127.0.0.1:8080/', function (data) {
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
//

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
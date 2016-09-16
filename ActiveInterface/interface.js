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


window.onload = function(){ 
    canvas = document.getElementById('floorCanvas');
    canvasContext = canvas.getContext("2d");
    var framesPerSecond = 60;
    initBoard();
    getRandomBoard();
    /*
    setInterval(function() {
        //scramble();       
        drawBoard();
        
    } , 1000/framesPerSecond);
    */
};

function refreshXML() {
    'use strict';
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
        moveStart = 0;
        drawBoard(dataHolderArray);
    });
}
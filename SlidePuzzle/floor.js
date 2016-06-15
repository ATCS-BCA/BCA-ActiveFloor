/*jslint browser: true*/
/*global $, jQuery*/

/*
function drawObj(type, xPos, yPos, size) {
    'use strict';
    context2D.fillStyle = 'red';

    if (type === 'square') {
        context2D.fillRect((xPos + (xCenter / size)), (yPos + (yCenter / size)), size, size);
    } else if (type === 'circle') {
        context2D.beginPath();
        context2D.arc((xPos + xCenter), (yPos + yCenter), size, 0, Math.PI * 2, true);
        context2D.closePath();
        context2D.fill();
    }
}
*/

// function drawCanvas(arr) {
//     'use strict';
//     canvas = document.getElementById('floorCanvas');
//     canvas.width = ledsX;
//     canvas.height = ledsY;
//     context2D = canvas.getContext('2d');
    
//     var i, tempRow, p, srchStr, tempX, tempY;
//     for (i = 0; i < arr.length; i += 1) {
//         tempRow = arr[i];
        
//         for (p = 0; p < tempRow.length; p += 1) {
//             srchStr = tempRow.substring(p, p + 1);
//             if (srchStr === charSearch) {
//                 tempX = p * ledPerSensorX;
//                 tempY = i * ledPerSensorY;
//                 readPos(tempX,tempY)
//             }
//         }
//     }
// }



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

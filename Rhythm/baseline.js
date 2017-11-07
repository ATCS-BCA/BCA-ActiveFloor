var canvas, context2D;

function draw() {
    'use strict';

    canvas = document.getElementById('floorCanvas');
    canvas.width = 192;
    canvas.height = 192;
    context2D = canvas.getContext('2d');
    context2D.fillColor = "#FF0000";
    context2D.fillStyle="#0A0";
    context2D.fillRect(40, 50, 50, 50);
}

$(document).ready(function () {
    'use strict';
    setInterval(function(){

        draw();
        //also need to check if individual countdowns are done
    }, 20);
});

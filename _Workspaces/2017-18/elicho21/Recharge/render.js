function drawCircle(id, xPos, yPos) {
    'use strict';
    context2D.save();

    context2D.globalAlpha = 0.8;
    if (time - existing[id].timeSpawned < lifespan / 3) {
        context2D.fillStyle = "lime";
    } else if (time - existing[id].timeSpawned < 2 * lifespan / 3) {
        context2D.fillStyle = "yellow";
    } else {
        context2D.fillStyle = 'red';
    }

    context2D.beginPath();
    context2D.arc(xPos, yPos, radius, 0, Math.PI * 2, true);
    context2D.closePath();
    context2D.fill();

    context2D.restore();

    context2D.strokeStyle = "white";
    context2D.lineWidth = 3;
    context2D.stroke();

    context2D.save();
    context2D.translate(xPos, yPos);
    context2D.beginPath();
    context2D.moveTo(0, 0);
    context2D.rotate((time - existing[id].timeSpawned) / lifespan * 2 * Math.PI);
    context2D.lineTo(0, -radius);
    context2D.stroke();
    context2D.restore();

    context2D.font = radius + "px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText((Math.ceil(lifespan - (time - existing[id].timeSpawned))).toString(), xPos, yPos);
}

function drawCircles () {
    "use strict";
    for (var i = 0; i < existing.length; i++) {
        var x = 0;
        var y = 0;
        x = existing[i].xPos;
        y = existing[i].yPos;
        drawCircle(i, x, y);
    }
    for (i = 0; i < trans.length; i++) {
        var xStart = trans[i].xStart;
        var yStart = trans[i].yStart;
        var xEnd = trans[i].xEnd;
        var yEnd = trans[i].yEnd;
        var startTime = trans[i].startTime;
        if (time >= startTime + transTime) {
            trans.splice(i, 1);
            continue;
        }
        drawTransition(xStart, yStart, xEnd, yEnd, startTime);
    }
    // console.log(existing);
}

function drawTransition(xStart, yStart, xEnd, yEnd, startTime) {

    xPos = lerp(xStart, xEnd, (time - startTime) / transTime);
    yPos = lerp(yStart, yEnd, (time - startTime) / transTime);

    context2D.beginPath();
    context2D.arc(xPos, yPos, radius, 0, Math.PI * 2, true);
    context2D.closePath();

    context2D.strokeStyle = "white";
    context2D.lineWidth = 3;
    context2D.stroke();
}

function lerp(a, b, n) {
    return n * (b - a) + a;
}
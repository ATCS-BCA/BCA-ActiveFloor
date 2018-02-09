function drawCircle(id, xPos, yPos) {
    'use strict';
    // Choose circle color
    context2D.save();

    context2D.globalAlpha = 0.8;
    if (time - existing[id].timeSpawned < lifespan / 3) {
        context2D.fillStyle = "lime";
    } else if (time - existing[id].timeSpawned < 2 * lifespan / 3) {
        context2D.fillStyle = "yellow";
    } else {
        context2D.fillStyle = 'red';
    }

    // Fill circle color
    context2D.beginPath();
    context2D.arc(xPos, yPos, radius, 0, Math.PI * 2, true);
    context2D.closePath();
    context2D.fill();

    context2D.restore();

    // Create outline of circle
    context2D.strokeStyle = "white";
    context2D.lineWidth = 3;
    context2D.stroke();

    // Make line
    context2D.save();
    context2D.translate(xPos, yPos);
    context2D.beginPath();
    context2D.moveTo(0, 0);
    context2D.rotate((time - existing[id].timeSpawned) / lifespan * 2 * Math.PI);
    context2D.lineTo(0, -radius);
    context2D.stroke();
    context2D.restore();

    // Make timer
    context2D.font = radius + "px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText((Math.ceil(lifespan - (time - existing[id].timeSpawned))).toString(), xPos, yPos);
}

function drawCircles () {
    "use strict";

    // Draw fixed
    for (var i = 0; i < existing.length; i++) {
        var x = 0;
        var y = 0;
        x = existing[i].xPos;
        y = existing[i].yPos;
        drawCircle(i, x, y);
    }

    // Draw transitioning
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

function startMenu() {
    context2D.font = "32px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText("Recharge", canvas.width / 2, canvas.height / 3);

    createButton("start", "Start", "24px Arial", "white", "white",
        canvas.width / 2, 2 * canvas.height / 3,  canvas.width / 2, canvas.height / 6);
}

function overMenu() {
    context2D.font = "32px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText("Game Over!", canvas.width / 2, canvas.height / 3);

    context2D.font = "18px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText("Score: " + score, canvas.width / 2, canvas.height / 2);

    createButton("menu", "Menu", "24px Arial", "white", "white",
        canvas.width / 2, 5 * canvas.height / 6,  canvas.width / 2, canvas.height / 6);
}

function createButton(name, text, font, textColor, borderColor, xPos, yPos, width, height) {
    buttons[name] = {
        text: text,
        font: font,
        textColor: textColor,
        borderColor: borderColor,
        xPos: xPos,
        yPos: yPos,
        width: width,
        height: height
    };

    // Form Rectangle
    context2D.beginPath();
    context2D.lineWidth = "4";
    context2D.strokeStyle = borderColor;
    context2D.rect(xPos - width / 2, yPos - height / 2, width, height);
    context2D.stroke();

    context2D.font = font;
    context2D.fillStyle = textColor;
    context2D.textAlign = "center";
    context2D.textBaseline = "middle";
    context2D.fillText(text, xPos, yPos);
}

function drawPoint (xPos, yPos) {
    context2D.fillStyle = "white";
    context2D.beginPath();
    context2D.arc(xPos, yPos, 8, 0, Math.PI * 2);
    context2D.closePath();
    context2D.fill();
}

function drawZones() {
    for (var i = 0; i < zones.length; i++) {
        if (zones[i].type === "line") {
            drawLine(i);
        }
    }
}

function drawLine(id) {
    var x1 = zones[id].points[0][0];
    var y1 = zones[id].points[0][1];
    var x2 = zones[id].points[1][0];
    var y2 = zones[id].points[1][1];
    drawPoint(x1, y1);
    drawPoint(x2, y2);

    context2D.beginPath();
    context2D.moveTo(x1, y1);
    context2D.lineTo(x2, y2);
    context2D.closePath();
    context2D.strokeStyle = "white";
    context2D.lineWidth = (zones[id].activated) ? 16 : 2;
    context2D.stroke();
}
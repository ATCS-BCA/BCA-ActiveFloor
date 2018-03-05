function drawPoint (xPos, yPos) {
    context2D.fillStyle = "white";
    context2D.beginPath();
    context2D.arc(xPos, yPos, 8, 0, Math.PI * 2);
    context2D.closePath();
    context2D.fill();
}

function drawZones() {
    for (let i = 0; i < zones.length; i++) {
        if (zones[i].type === "line") {
            drawLine(i);
        }
        if (zones[i].type === "tri") {
            drawTri(i);
        }
    }
}

function transition(id) {
    for (let i = 0; i < zones[id].current.length; i++) {
        for (let j = 0; j < 2; j++) {
            zones[id].current[i][j] = lerp(zones[id].original[i][j],
                zones[id].destination[i][j],
                (time - zones[id].transStart) / transTime)
        }
  }
}

function drawLine(id) {
    let x1 = zones[id].current[0][0];
    let y1 = zones[id].current[0][1];
    let x2 = zones[id].current[1][0];
    let y2 = zones[id].current[1][1];
    drawPoint(x1, y1);
    drawPoint(x2, y2);

    context2D.beginPath();
    context2D.moveTo(x1, y1);
    context2D.lineTo(x2, y2);
    context2D.closePath();
    context2D.strokeStyle = "white";
    context2D.lineCap = "round";
    context2D.lineWidth = (zones[id].activated) ? 16 : 2;
    context2D.stroke();
}

function drawTri(id) {
    let x1 = zones[id].current[0][0];
    let y1 = zones[id].current[0][1];
    let x2 = zones[id].current[1][0];
    let y2 = zones[id].current[1][1];
    let x3 = zones[id].current[2][0];
    let y3 = zones[id].current[2][1];
    drawPoint(x1, y1);
    drawPoint(x2, y2);
    drawPoint(x3, y3);

    context2D.beginPath();
    context2D.moveTo(x1, y1);
    context2D.lineTo(x2, y2);
    context2D.lineTo(x3, y3);
    context2D.lineTo(x1, y1);
    context2D.closePath();
    context2D.strokeStyle = "white";
    context2D.lineJoin = "round";
    context2D.lineWidth = (zones[id].activated) ? 16 : 2;
    context2D.stroke();
    if (zones[id].activated)
        context2D.fill();
}
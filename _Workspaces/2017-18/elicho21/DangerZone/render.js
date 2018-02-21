function drawPoint (xPos, yPos) {
    context2D.fillStyle = "white";
    context2D.beginPath();
    context2D.arc(xPos, yPos, 8, 0, Math.PI * 2);
    context2D.closePath();
    context2D.fill();
}
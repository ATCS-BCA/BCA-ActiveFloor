var time = 0;
var zones = [];

/* Zone Object
{
    "type" = "";
    "points" = [[x1, y1],... [xn, yn]];
}
 */

function drawScreen() {
    for (var i = 0; i < zones.length; i++) {
        if (zones[i].type === "line") {
            var x1 = zones[i].points[0][0];
            var y1 = zones[i].points[0][1];
            var x2 = zones[i].points[1][0];
            var y2 = zones[i].points[1][1];
            drawPoint(x1, y1);
            drawPoint(x2, y2);

            context2D.beginPath();
            context2D.moveTo(x1, y1);
            context2D.lineTo(x2, y2);
            context2D.closePath();
            context2D.strokeStyle = "white";
            context2D.stroke();
        }
    }
}

function createLine() {
    zones.push({
        "type": "line",
        "points": [
            [Math.floor(Math.random() * 192), Math.floor(Math.random() * 192)],
            [Math.floor(Math.random() * 192), Math.floor(Math.random() * 192)]
            ]
        });
}

function manageTap(posX, posY) {

}
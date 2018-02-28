var time = 0;
var lifespan = 4;
var zones = [];

/* Zone Object
{
    "type" = "";
    "points" = [[x1, y1],... [xn, yn]];
    "lastSpawned" = 0;
    "activated" = false;
}
*/

function drawScreen() {
    manageZones();
    drawZones();
}

function manageZones() {
    for (var i = 0; i < zones.length; i++) {
        if (time >= zones[i].lastSpawned + lifespan)
            zones.splice(i, 1);
        if (time >= zones[i].lastSpawned + lifespan - 1)
            zones[i].activated = true;
    }
}

function createLine() {
    zones.push({
        "type": "line",
        "points": [
            [Math.floor(Math.random() * 192), Math.floor(Math.random() * 192)],
            [Math.floor(Math.random() * 192), Math.floor(Math.random() * 192)]
            ],
        "lastSpawned": time,
        "activated": false,
        "function": function () {}
        });
}

function manageTap(posX, posY) {
    for (var i = 0; i < zones.length; i++) {

    }
}
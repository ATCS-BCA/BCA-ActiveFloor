var time = 0;
var lifespan = 3;
var zones = [];
var transTime = 3;

/* Zone Object
{
    "type" = "";
    "current" = [[x1, y1],... [xn, yn]];
    "original" = [[x1, y1],... [xn, yn]];
    "destination" = [[x1, y1],... [xn, yn]];
    "lastSpawned" = 0;
    "activated" = false;
    "transStart" = 0;
}
*/

function drawScreen() {
    manageZones();
    drawZones();
}

function manageZones() {
    for (var i = 0; i < zones.length; i++) {
        if (time >= zones[i].lastSpawned + lifespan) {
            if (zones[i].activated) {
                zones[i].activated = false;
                zones[i].transStart = time;

                zones[i].original = copy(zones[i].destination);
                var point1 = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 192)];
                var point2 = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 192)];
                zones[i].destination = [point1, point2];
            }

            transition(i);

            if (time >= zones[i].lastSpawned + lifespan + transTime) {
                zones[i].lastSpawned = time;
                zones[i].current = copy(zones[i].destination);
            }
        }
        else if (time >= zones[i].lastSpawned + lifespan - 1)
            zones[i].activated = true;
    }
}

function createLine() {
    var point1 = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 192)];
    var point2 = [Math.floor(Math.random() * 192), Math.floor(Math.random() * 192)];
    zones.push({
        "type": "line",
        "current": [point1, point2],
        "original": [point1, point2],
        "destination": [point1, point2],
        "lastSpawned": time,
        "activated": false,
        "transStart": 0
        });
}

function manageTap(posX, posY) {
    for (var i = 0; i < zones.length; i++) {

    }
}
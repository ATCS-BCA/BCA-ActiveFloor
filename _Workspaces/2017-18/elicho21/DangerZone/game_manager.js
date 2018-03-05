let time = 0;
let lifespan = 2;
let zones = [];
let transTime = 1;

/* Zone Object
{
    "type" = "";
    "current" = [[x1, y1],... [xn, yn]];
    "original" = [[x1, y1],... [xn, yn]];
    "destination" = [[x1, y1],... [xn, yn]];
    "lastSpawned" = 0;
    "activated" = false;
    "transStart" = 0;
    "function" = function () {check if tap in line or polygon}
}
*/

function drawScreen() {
    manageZones();
    drawZones();
}

function manageZones() {
    for (let i = 0; i < zones.length; i++) {
        if (time >= zones[i].lastSpawned + lifespan) {
            if (zones[i].activated) {
                zones[i].activated = false;
                zones[i].transStart = time;

                zones[i].original = copy(zones[i].destination);
                if (zones[i].type === "line")
                    zones[i].destination = generatePoints("line");
                else if (zones[i].type === "tri") {
                    zones[i].destination = generatePoints("tri");
                }
                else if (zones[i].type === "quad") {
                    zones[i].destination = generatePoints("quad");
                }
            }

            transition(i);

            if (time >= zones[i].lastSpawned + lifespan + transTime) {
                zones[i].lastSpawned = time;
                zones[i].current = copy(zones[i].destination);
                if (zones[i].type === "line")
                    zones[i].function = getLineFunction(zones[i].current[0], zones[i].current[1]);
                else
                    zones[i].function = getPolyFunction(zones[i].current);
            }
        }
        else if (time >= zones[i].lastSpawned + lifespan - 1)
            zones[i].activated = true;
    }
}

function createLine() {
    points = generatePoints("line");
    zones.push({
        "type": "line",
        "current": [...points],
        "original": [...points],
        "destination": [...points],
        "lastSpawned": time,
        "activated": false,
        "transStart": 0,
        "function": getLineFunction(...points)
    });
}

function createTri() {
    let points = generatePoints("tri");
    zones.push({
        "type": "tri",
        "current": [...points],
        "original": [...points],
        "destination": [...points],
        "lastSpawned": time,
        "activated": false,
        "transStart": 0,
        "function": getPolyFunction(...points)
    });
}

function createQuad() {
    let points = generatePoints("quad");
    zones.push({
        "type": "quad",
        "current": [...points],
        "original": [...points],
        "destination": [...points],
        "lastSpawned": time,
        "activated": false,
        "transStart": 0,
        "function": getPolyFunction(...points)
    });
}

function getLineFunction(p1, p2) {
    // y - y1 = m(x - x1)
    const slope = (p1[1] - p2[1]) / (p1[0] - p2[0]);
    function f (x) {return slope * (x - p1[0]) + p1[1]}
    return function (x, y) {return inRange(
        x, y,
        Math.min(p1[0], p2[0]) - 8, Math.max(p1[0], p2[0]) + 8,
        f(x) - 8, f(x) + 8
    )};
}

function pointInPolygon(nVerts, xVerts, yVerts, xPoint, yPoint)
{
    let i, j;
    let c = false;
    for (i = 0, j = nVerts-1; i < nVerts; j = i++) {
        if ( ((yVerts[i]>yPoint) !== (yVerts[j]>yPoint)) &&
            (xPoint < (xVerts[j]-xVerts[i]) * (yPoint-yVerts[i]) / (yVerts[j]-yVerts[i]) + xVerts[i]) )
            c = !c;
    }
    return c;
}

function getPolyFunction(points) {
    const xVerts = points.map(x => x[0]);
    const yVerts = points.map(x => x[1]);

    return function (x, y) {return pointInPolygon(points.length, xVerts, yVerts, x, y)};
}

function manageTap(posX, posY) {
    for (let i = 0; i < zones.length; i++) {
        if (zones[i].function(posX, posY) && zones[i].activated) {
            console.log("Game Over!");
        }
    }
}

function generatePoints(type) {
    if (type === "line") {
        return [[Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
            [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)]]
    }
    else if (type === "tri") {
        let points = [
            [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
            [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
            [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)]
        ];
        while (!inRange(triArea(points[0], points[1], points[2]), 0, 1152, 9216, 0, 0)) {
            points = [
                [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
                [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
                [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)]
            ];
        }
        return points;
    }
    else if (type === "quad") {
        let points = [
            [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
            [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
            [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
            [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)]
        ];
        while (!inRange(triArea(points[0], points[1], points[2]), 0, 1152, 9216, 0, 0)) {
            points = [
                [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
                [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
                [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)],
                [Math.floor(Math.random() * 193), Math.floor(Math.random() * 193)]
            ];
        }
        return points;
    }
}

function triArea(p1, p2, p3) {
    return Math.abs(p1[0] * (p2[1] - p3[1]) + p2[0] * (p3[1] - p1[1]) + p3[0] * (p1[1] - p2[1]));
}
let time = 0;
let lifespan = 3;
let zones = [];
let transTime = 3;
let score = 0;
let zoneCount = 1;
const interpolationArray = [
    function (a, b, n) {return lerp(a, b, n)},
    function (a, b, n) {return easeIn(a, b, n)},
    function (a, b, n) {return easeOut(a, b, n)},
    function (a, b, n) {return easeInOut(a, b, n)},
    function (a, b, n) {return cosineInterpolation(a, b, n)},
    function (a, b, n) {return circInterpolation(a, b, n)},
    function (a, b, n) {return polynomialInterpolation(a, b, n)}
];

/* Zone Object
{
    "type" = "";
    "current" = [[x1, y1],... [xn, yn]];
    "original" = [[x1, y1],... [xn, yn]];
    "destination" = [[x1, y1],... [xn, yn]];
    "lastSpawned" = 0;
    "activated" = false;
    "transStart" = 0;
    "function" = function () {check if tap in zone};
    "color" = #FFFFFF;
    "transition" = 0;
}
*/

function drawScreen() {
    drawZones();
    manageZones();
    drawScore();
    manageDifficulty();
}

function manageZones() {
    for (let i = 0; i < zones.length; i++) {
        if (time >= zones[i].lastSpawned + lifespan) {
            if (zones[i].activated) {
                zones[i].activated = false;
                zones[i].transStart = time;

                zones[i].original = copy(zones[i].destination);
                zones[i].destination = generatePoints(zones[i].type);

                zones[i].transition = Math.floor(Math.random() * 7);
                score++;
            }

            transition(i);

            if (time >= zones[i].lastSpawned + lifespan + transTime) {
                zones[i].lastSpawned = time;
                zones[i].current = copy(zones[i].destination);
                if (zones[i].type === "line")
                    zones[i].function = getLineFunction(...zones[i].current);
                else
                    zones[i].function = getPolyFunction(zones[i].current);
            }
        }
        else if (time >= zones[i].lastSpawned + lifespan - 1)
            zones[i].activated = true;
    }
}

function manageDifficulty() {
    lifespan = 1.9 * Math.pow(0.9, Math.floor(score / 5)) + 1.1;
    transTime = 2.8 * Math.pow(0.9, Math.floor(score / 5)) + 0.2;
    console.log("score: " + score + "; lifespan: " + lifespan + "; transTime: " + transTime);

    let delay = Math.random() * 3000;
    if (score >= 50 && zoneCount < 6) {
        zoneCount++;
        setTimeout(function () {createQuad()}, delay);
    }
    if (score >= 30 && zoneCount < 5) {
        zoneCount++;
        setTimeout(function () {createQuad()}, delay);
    }
    if (score >= 20 && zoneCount < 4) {
        zoneCount++;
        setTimeout(function () {createTri()}, delay);
    }
    else if (score >= 10 && zoneCount < 3) {
        zoneCount++;
        setTimeout(function () {createTri()}, delay);
    }
    else if (score >= 5 && zoneCount < 2) {
        zoneCount++;
        setTimeout(function () {createLine()}, delay);
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
        "function": getLineFunction(...points),
        "color": randomColor({luminosity: "dark"})
    });
}
// "#"+((1<<24)*Math.random()|0).toString(16)
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
        "function": getPolyFunction(...points),
        "color": randomColor({luminosity: "dark"})
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
        "function": getPolyFunction(...points),
        "color": randomColor({luminosity: "dark"})
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
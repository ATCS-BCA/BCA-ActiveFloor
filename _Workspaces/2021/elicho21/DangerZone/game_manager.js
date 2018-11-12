let time = 0;
let lifespan = 3;
let zones = [];
let transTime = 3;
let score = 0;
let zoneCount = 1;
let screen = "main";
let buttons = {};
let mode = "Line";
const interpolationArray = [
    function (a, b, n) {return lerp(a, b, n)},
    function (a, b, n) {return easeIn(a, b, n)},
    function (a, b, n) {return easeOut(a, b, n)},
    function (a, b, n) {return easeInOut(a, b, n)},
    function (a, b, n) {return cosineInterpolation(a, b, n)},
    function (a, b, n) {return circInterpolation(a, b, n)},
    function (a, b, n) {return polynomialInterpolation(a, b, n)}
];
const create = [
    createLine,
    createTri,
    createQuad
];
let diffVar = 0;
let limit = 4;

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
    if (screen === "main") {
        drawMainMenu();
    }
    else if (screen === "game") {
        drawZones();
        manageZones();
        drawScore();
        drawMode();
        manageDifficulty();
    }
    else if (screen === "over") {
        drawOverMenu();
    }
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
                diffVar++;
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
        else if (time >= zones[i].lastSpawned + lifespan - 1) {
            zones[i].activated = true;
        }

    }
}

function manageDifficulty() {
    lifespan = 1.9 * Math.pow(0.95, Math.floor(score / 5)) + 1.1;
    transTime = 2.8 * Math.pow(0.95, Math.floor(score / 5)) + 0.2;
/*    console.log("score: " + score + "; lifespan: " + lifespan + "; transTime: " + transTime);*/
/*    console.log(diffVar + " " +  Math.floor(4 + 0.02 * score * score));*/

    let delay = Math.random() * 3000;
    if (diffVar >= limit) {
        zoneCount++;
        diffVar = 0;
        limit = Math.floor(0.02 * score * score + 4);
        if (mode === "Line") createLine();
        else if (mode === "Tri") createTri();
        else if (mode === "Quad") createQuad();
        else {
            setTimeout(function () {
                create[Math.floor(Math.random() * 3)]();
            }, delay);
        }

    }
}

function createLine() {
    points = generatePoints("line");
    zones.push({
        "type": "line",
        "current": points,
        "original": points,
        "destination": points,
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
        "current": points,
        "original": points,
        "destination": points,
        "lastSpawned": time,
        "activated": false,
        "transStart": 0,
        "function": getPolyFunction(points),
        "color": randomColor({luminosity: "dark"})
    });
}

function createQuad() {
    let points = generatePoints("quad");
    zones.push({
        "type": "quad",
        "current": points,
        "original": points,
        "destination": points,
        "lastSpawned": time,
        "activated": false,
        "transStart": 0,
        "function": getPolyFunction(points),
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
    if (screen === "main") {
        let keys = Object.keys(buttons);
        for (let i = 0; i < 4; i++) {
            if (inRange(posX, posY,
                    buttons[keys[i]].xPos - buttons[keys[i]].width / 2,
                    buttons[keys[i]].xPos + buttons[keys[i]].width / 2,
                    buttons[keys[i]].yPos - buttons[keys[i]].height / 2,
                    buttons[keys[i]].yPos + buttons[keys[i]].height / 2)) {
                mode = keys[i].charAt(0).toUpperCase() + keys[i].slice(1);
                initGame();
            }
        }
    }
    else if (screen === "game") {
        for (let i = 0; i < zones.length; i++) {
            if (zones[i].function(posX, posY) && zones[i].activated) {
                screen = "over";
                drawOverMenu();
            }
        }
    }
    else if (screen === "over") {
        if (inRange(posX, posY,
                buttons["main"].xPos - buttons["main"].width / 2,
                buttons["main"].xPos + buttons["main"].width / 2,
                buttons["main"].yPos - buttons["main"].height / 2,
                buttons["main"].yPos + buttons["main"].height / 2)) {
            screen = "main";
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

function initGame () {
    screen = "game";
    time = 0;
    lifespan = 3;
    zones = [];
    transTime = 3;
    score = 0;
    zoneCount = 1;
    diffVar = 0;
    limit = 4;
    setTimeout(function () {
        if (mode === "Line")
            createLine();
        else if (mode === "Tri")
            createTri();
        else if (mode === "Quad")
            createQuad();
        else if (mode === "Random")
            create[Math.floor(Math.random() * 3)]();
    }, 2000);
}
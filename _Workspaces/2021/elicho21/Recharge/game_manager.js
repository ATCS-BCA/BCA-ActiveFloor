var existing = [];
var time = 0;
var lastSpawn = 0;
var radius = 24;
var lifespan = 5;
var spawnRate = 10;
var trans = [];
var transTime  = 1;
var score = 0;
var level = 0;
var screen = "start";
var buttons = {};

function addPosition () {
    "use strict";
    var xPos = Math.floor(Math.random() * (192 - radius * 2)) + radius;
    var yPos = Math.floor(Math.random() * (192 - radius * 2)) + radius;
    setTimeout(function () {
        existing.push({"xPos" : xPos, "yPos" : yPos, "timeSpawned" : time});
    }, transTime * 1000);
    return [xPos, yPos];
}

function managePositions() {
    if (time < 0.017)
        setTimeout(addPosition(), 3000);

    if (time >= lastSpawn + spawnRate) {
        addPosition();
        lastSpawn = time;
    }

    for (var i = 0; i < existing.length; i++) {
        if (time > existing[i].timeSpawned + lifespan) {
            existing.splice(i, 1);
            screen = "over";
        }
    }
}

function manageDifficulty () {
    spawnRate = 10 * Math.pow(0.9, Math.floor(score / 5));
    transTime = Math.pow(0.95, Math.floor(score / 5));
    radius = 24 * Math.pow(0.98, Math.floor(score / 5));
    lifespan = 5 * Math.pow(0.97, Math.floor(score / 5));
}

function drawScore () {
    context2D.font = "12px Arial";
    context2D.fillStyle = "white";
    context2D.textAlign = "left";
    context2D.textBaseline = "top";
    context2D.fillText("Score: " + score, 5, 5);
}

function drawScreen() {
    if (screen === "start") {
        startMenu();
    }
    else if (screen === "game") {
        managePositions();
        drawScore();
        manageDifficulty();
        drawCircles();
    }
    else if (screen === "over") {
        overMenu();
    }
}

function recharge(id) {
    addResult = addPosition();
    trans.push({
        xStart: existing[id].xPos,
        yStart: existing[id].yPos,
        xEnd: addResult[0],
        yEnd: addResult[1],
        startTime: time,
        transitionX: Math.floor(Math.random() * 7),
        transitionY: Math.floor(Math.random() * 7)
    });

    score += 1;

    existing.splice(id, 1);
}

function manageTap (posX, posY) {
    if (screen === "start") {
        if (inRange(posX, posY,
                buttons["start"].xPos - buttons["start"].width / 2,
                buttons["start"].xPos + buttons["start"].width / 2,
                buttons["start"].yPos - buttons["start"].height / 2,
                buttons["start"].yPos + buttons["start"].height / 2)) {
            initGame();
            screen = "game";
        }
    }
    else if (screen === "game") {
        for (var i = 0; i < existing.length; i++) {
            if (inRange(posX, posY, existing[i].xPos - radius, existing[i].xPos + radius,
                    existing[i].yPos - radius, existing[i].yPos + radius)) {
                recharge(i);
            }
        }
    }
    else if (screen === "over") {
        if (inRange(posX, posY,
                buttons["menu"].xPos - buttons["menu"].width / 2,
                buttons["menu"].xPos + buttons["menu"].width / 2,
                buttons["menu"].yPos - buttons["menu"].height / 2,
                buttons["menu"].yPos + buttons["menu"].height / 2)) {
            screen = "start";
        }
    }
}

function initGame() {
    existing = [];
    time = 0;
    lastSpawn = 0;
    radius = 24;
    lifespan = 5;
    spawnRate = 10;
    trans = [];
    transTime = 1;
    score = 0;
}

function manageInterpolation (a, b, n, t) {
    if (t === 0)
        return lerp(a, b, n);
    else if (t === 1)
        return easeIn(a, b, n);
    else if (t === 2)
        return easeOut(a, b, n);
    else if (t === 3)
        return easeInOut(a, b, n);
    else if (t === 4)
        return cosineInterpolation(a, b, n);
    else if (t === 5)
        return circInterpolation(a, b, n);
    else if (t === 6)
        return polynomialInterpolation(a, b, n);
}

function lerp(a, b, n) {
    return n * (b - a) + a;
}

// Cubic
function easeIn(a, b, n) {
    return (n * n * n) * (b - a) + a;
}

// Cubic
function easeOut(a, b, n) {
    return ((--n) * n * n + 1) * (b - a) + a;
}

// Quadratic
function easeInOut(a, b, n) {
    return (n < 0.5) ? (2 * n * n) * (b - a) + a : (-1 + (4 - 2 * n) * n) * (b - a) + a;
}

function cosineInterpolation(a, b, n) {
    return (-0.5 * Math.cos(3 * Math.PI * n) + 0.5) * (b - a) + a;
}

function circInterpolation(a, b, n) {
    return Math.sqrt(1 - (n - 1) * (n - 1)) * (b - a) + a;
}

// Cubic
function polynomialInterpolation(a, b, n) {
    return ((8 * n * n * n) - (12 * n * n) + (5 * n)) * (b - a) + a;
}
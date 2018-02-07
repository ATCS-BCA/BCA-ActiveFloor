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
    // console.log(time);
    if (time >= lastSpawn + spawnRate) {
        addPosition();
        lastSpawn = time;
    }

    for (var i = 0; i < existing.length; i++) {
        if (time > existing[i].timeSpawned + lifespan) {
            existing.splice(i, 1);
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
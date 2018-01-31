/* Created By Anthony Lekan 01/10/18 */

var screen;
var score;

var buttons;
var lavaBoxSize;
const lavaColors = ['#ffff44', '#ff6600', '#cc4422', '#553333', '#eadab5'];
const safeColor = '#eadab5';

// Whether the lava boxes are active
var isFire;

const floorTiles = [];
var safeFloorTiles = [];
var maxSafeTiles;
var counter;

function LavaTile(x, y, boxSize, fillStyle, globalAlpha) {
    this.x = x;
    this.y = y;
    this.boxSize = boxSize;
    this.fillStyle = fillStyle;
    this.globalAlpha = globalAlpha;
    if(fillStyle === safeColor) {
        this.isLava = false;
    } else {
        this.isLava = true;
    }
}

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

// Create All buttons
// Inits canvas screen
function start() {
    screen = 1;
    score = 0;
    buttons = [];
    lavaBoxSize = 32;
    maxSafeTiles = 2;
    isFire = false;
    counter = 5;
    seconds = 0;

    startTimer();
    initButtons();
}

var button = function() {

};

function initButtons() {

}

function renderScreen(screen) {
    if(screen == 0) {
        
    } else if(screen == 1) {
        drawLava();
        drawTimer();
    } else if(screen == 2) {
        context2D.fillStyle = 'red';
        context2D.rect(0, 0, canvas.width, canvas.height);
    }
}

function drawLava() {
    var safeTiles = 0;
    if (floorTiles.length == 0) {
        for (var x = 0; x < 192; x += lavaBoxSize) {
            for (var y = 0; y < 192; y += lavaBoxSize) {
                if(x == 0 && y == 0) {
                    continue;
                }
                context2D.globalAlpha = 0.5;
                context2D.fillStyle = lavaColors.random();
                if(context2D.fillStyle == safeColor) {
                    if(maxSafeTiles > safeTiles) {
                        safeTiles += 1;
                        // safeFloorTiles.append(new LavaTile(x, y, lavaBoxSize, context2D.fillStyle, context2D.globalAlpha));
                    } else {
                        while(context2D.fillStyle == safeColor) {
                            context2D.fillStyle = lavaColors.random();
                        }
                    }
                }
                context2D.fillRect(x, y, lavaBoxSize, lavaBoxSize);
                floorTiles.push(new LavaTile(x, y, lavaBoxSize, context2D.fillStyle, context2D.globalAlpha));
            }
        }
    } else {
        floorTiles.forEach(function (tile) {
            context2D.globalAlpha = tile.globalAlpha;
            context2D.fillStyle = tile.fillStyle;
            context2D.fillRect(tile.x, tile.y, tile.boxSize, tile.boxSize);
        });
    }
}

function startTimer() {
    setInterval(function() {
        if(screen == 1) {
            seconds += 0.5;
            if(seconds == 5) {
                isFire = true;
            }
        }
    }, 500);
}

function drawTimer() {
    context2D.strokeStyle = 'orange';
    context2D.strokeRect(0, 0, 32, 32);
    context2D.strokeStyle = 'yellow';
    context2D.strokeText(parseInt(seconds).toString(), 0, 16, 32);
}

function acceptInput(x, y) {
    if(screen == 0) {
        
    } else if(screen == 1) {
        if(isFire) {
            var safe = false;
            safeFloorTiles.forEach(function(tile) {
                if(tile.isLava) {
                    if (x < tile.x + lavaBoxSize && x >= tile.x) {
                        if (y < tile.y + lavaBoxSize && y >= tile.y) {
                            safe = true;
                        }
                    }
                }
            });
            if(!safe) {
                gameOver();
            }
        }
    } else {
        
    }
}

function gameOver() {
    screen = 2;
}
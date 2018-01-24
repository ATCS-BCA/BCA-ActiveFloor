/* Created By Anthony Lekan 01/10/18 */

var screen;
var score;

var buttons;
var lavaBoxSize;
const lavaColors = ['#ffff44', '#ff6600', '#cc4422', '#553333', '#eadab5'];
const safeColor = '#eadab5';

// Whether the lava boxes are active
var isFire;

var floorTiles = [];
var maxSafeTiles;
var counter;
var timer;
var round;

const marginOfError = 6;
var safeTime;

const BREAK_EXCEPTION = {}

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
    this.isTile = function(x, y) {
        return ((x >= this.x && x <= this.x + this.boxSize-marginOfError)  && (y >= this.y && y <= this.y+this.boxSize-marginOfError))
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
    safeTime = 5;
    // Account for 1 second delay
    seconds -= 1;
    round = 1;

    startTimer();
    initButtons();
}

var button = function() {

};

// TODO Make button objects
function initButtons() {

}

// TODO Make menu screen
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

// TODO Make a 1+ lava round system
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
                    if(maxSafeTiles > safeTiles && Math.floor(Math.random() * lavaBoxSize) <= lavaBoxSize/2) {
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

// TODO !IMPORTANT! - integrate timer with main loop rather then having separate threads
function startTimer() {
    timer = setInterval(function() {
        if(screen == 1) {
            seconds += 0.5;
            if(safeTime - seconds == 0) {
                isFire = true;
                seconds = 1;
            } else if(safeTime - seconds <= -1) {
                isFire = false;
                floorTiles = [];
                round += 1;
                seconds = 0;
            }
        }
    }, 500);
}

function drawTimer() {
    context2D.strokeStyle = 'orange';
    context2D.strokeRect(0, 0, lavaBoxSize, lavaBoxSize);
    context2D.strokeStyle = 'yellow';
    context2D.font = '20px Comic Sans Serif';
    var textHeight = context2D.measureText('W').width;
    context2D.strokeText(parseInt(safeTime-seconds).toString(), (lavaBoxSize/2)-(textHeight/2), (lavaBoxSize/2)+(textHeight/2)-5, lavaBoxSize);
}

function acceptInput(x, y) {
    if(screen == 0) {
        
    } else if(screen == 1) {
        if(isFire) {
            floorTiles.forEach(function(tile) {
                if(tile.isLava) {
                    if(tile.isTile(x, y)) {
                        tile.fillStyle = 'green';
                        gameOver();
                        throw BREAK_EXCEPTION;
                    }

                }
            });
        } else {
            context2D.fillStyle = 'purple';
            context2D.fillRect(x, y, 5, 5);
        }
    }
}

// TODO Draws Scorebox and tracks score
function drawScore() {

}

// TODO Draw Game Over Button
function gameOver() {
    isFire = false;
    window.clearInterval(timer);
}

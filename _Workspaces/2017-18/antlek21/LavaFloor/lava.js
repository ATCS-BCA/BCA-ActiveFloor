/* Created By Anthony Lekan 01/10/18 */

var screen;
var timer;

var buttons;
var lavaBoxSize;
const lavaColors = ['#ffff44', '#ff6600', '#cc4422', '#553333', '#eadab5'];
const safeColor = '#eadab5';

const marginOfError = 5;

// Whether the lava boxes are active
var isFire;

var floorTiles = [];
var maxSafeTiles;
var counter;
var level = 0;

// 1 = TIMER
// 5 = LEVEL COUNT
// Switch between rendering the timer or level
var switchCount = 1;

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
    this.isOnTile = function(x, y) {
        if(x <= this.x+boxSize-marginOfError && x >= this.x) {
            if(y <= this.y+boxSize-marginOfError && y >= this.y) {
                return true;
            }
        }
        return false;
    }
}

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

// Create All buttons
// Inits canvas screen
function start() {
    screen = 0;
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

var Button = function(x, y, text, bx, by, color, borderColor) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.width = context2D.measureText(text).width;
    this.height = context2D.measureText('M').width;
    this.bx = bx;
    this.by = by;
    this.color = color;
    this.borderColor = borderColor;
};

function initButtons() {
    this.startGameButton = new Button(50, 50, "Hello", 5, 5, 'orange', 'black');
}

function drawButton(button) {
    context2D.strokeStyle = button.borderColor;
    context2D.strokeRect(button.x-button.bx, button.y-button.by, button.x + button.width, button.y + button.height);

    context2D.strokeStyle = button.color;
    context2D.strokeText(button.text, button.x, button.y);

}

function renderScreen(screen) {
    if(screen == 0) {
        drawButton(this.startGameButton);
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

function nextLevel() {
    isFire = false;
    level += 1;
    seconds = 0;
    floorTiles = [];
}

function startTimer() {
    timer = setInterval(function() {
        if(screen == 1) {
            seconds += 0.5;
            if(seconds == 5) {
                isFire = true;
            }
        }
    }, 500);
}

function drawTimer() {
    if(switchCount == 1) {
        context2D.strokeStyle = 'orange';
        context2D.strokeRect(0, 0, 32, 32);
    }
    if(seconds <= 5) {
        context2D.strokeStyle = 'yellow';
        context2D.fontStyle = 'Comic Sans Serif 20px';
        context2D.strokeText(parseInt(seconds).toString(), 0, 16, 32);
    }
}

function acceptInput(x, y) {
    if(screen == 0) {
        
    } else if(screen == 1) {
        if(isFire) {
            floorTiles.forEach(function(tile) {
                if(tile.isLava) {
                    if(tile.isOnTile(x, y)) {
                        tile.fillStyle = 'green';
                        gameOver();
                    }

                }
            });
        }
    } else {

    }
}

function gameOver() {
    clearInterval(timer);
    isFire = false;
}

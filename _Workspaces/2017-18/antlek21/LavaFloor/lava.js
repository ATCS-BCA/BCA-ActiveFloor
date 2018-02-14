/* Created By Anthony Lekan 01/10/18
TODO:
- Fix Time!
- Implement Buttons
- Finish Gamestate & gameover screen
*/

var screen;
var globalTime = 0;

var buttons;
var lavaBoxSize;
const lavaColors = ['#ffff44', '#ff6600', '#cc4422', '#553333', '#eadab5'];
const safeColor = '#eadab5';

const marginOfError = 5;

// Whether the lava boxes are active
var isFire;

var floorTiles = [];
var maxSafeTiles;
var secondCount;
var level = 0;

var maxSecondCount;


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
    screen = 1;
    score = 0;
    buttons = [];
    lavaBoxSize = 32;
    maxSafeTiles = 2;
    isFire = false;
    secondCount = 0;
    maxSecondCount = 5;
    level = 1;

    initButtons();
}

var Button = function(x, y, text, bx, by, color, borderColor) {
    this.x = x;
    this.y = y;
    this.text = text;
    // this.width = context2D.measureText(text).width;
    // this.height = context2D.measureText('M').width;
    this.bx = bx;
    this.by = by;
    this.color = color;
    this.borderColor = borderColor;
};

function initButtons() {
    this.startGameButton = new Button(50, 50, "Hello", 5, 5, 'orange', 'red');
}

function drawButton(button) {
    context2D.strokeStyle = button.borderColor;
    context2D.strokeRect(button.x, button.y, 50, 50);

    context2D.strokeStyle = button.color;
    context2D.strokeText(button.text, button.x, button.y);

}

function renderScreen(screen) {
    updateTime();
    if(screen == 0) {
        // Draw "The Floor is Lava" Logo/Text
        // draw "Play" Button
    } else if(screen == 1) {
        drawLava();
        drawScore();
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
    secondCount = 0;
    floorTiles = [];
    recalculateDifficulty();
}

function recalculateDifficulty() {
    maxSecondCount = 5*Math.pow(Math.E, -0.01*level);
}

function updateTime() {
    // Convert millseconds to seconds
    globalTime += refreshTime/1000;
    if(screen == 1) {
        secondCount += 0.5;
        if(maxSecondCount-secondCount <= 0) {
            isFire = true;
            nextLevel();
        }
    }
}

function drawScore() {
    if(maxSecondCount-secondCount > 0) {
        context2D.strokeStyle = 'yellow';
        context2D.fontStyle = 'Comic Sans Serif 20px';
        context2D.strokeText("Time: " + parseInt(maxSecondCount-secondCount).toString(), 0, 16, 32);
        context2D.strokeStyle = 'yellow';
        context2D.fontStyle = 'Comic Sans Serif 20px';
        context2D.strokeText("Level: " + parseInt(level).toString(), 0, 16-10, 32);
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
    isFire = false;
}

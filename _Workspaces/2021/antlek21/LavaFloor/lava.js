/* Created By Anthony Lekan 01/10/18 */
const lavaColors = ['#ffff44', '#ff6600', '#cc4422', '#553333'];
// const safeColor = '#eadab5';
const safeColor = 'white';

const lavaBoxSizes = [24, 32, 48];

var GAME_STATES = {
    HOME: 0,
    IN_GAME: 1,
    GAME_OVER: 2
};

const marginOfError = 5;

// Whether the lava boxes are active
var screen;
var buttons;
var isFire;
var floorTiles;
var level;

var lavaBoxSize;
var secondWait;
var maxSafeTiles;

var startGameButton;
var restartButton;

var displayNumber;

// What the globalTime was set to when the level started
var lastLevelStartTime;

function LavaTile(x, y, boxSize, fillStyle, globalAlpha) {
    this.x = x;
    this.y = y;
    this.boxSize = boxSize;
    this.fillStyle = fillStyle;
    this.globalAlpha = globalAlpha;
    if(fillStyle == safeColor) {
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
    level = 0;
    buttons = [];
    lavaBoxSize = 48;
    maxSafeTiles = 5;
    secondWait = 5;
    floorTiles = [];
    isFire = false;
}

var Button = function(x, y, text, color, borderColor) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.width = (canvas.width / 2) - (context2D.measureText(text).width / 2);
    this.height = (canvas.width / 2) - (context2D.measureText(text).width / 2);
    this.bx = (canvas.width / 2) - (context2D.measureText(text).width / 2) - 15;
    this.by = context2D.measureText(text).width + 40;
    this.color = color;
    this.borderColor = borderColor;
};

function initButtons() {
    this.startGameButton = new Button(50, 50, "Hello", 5, 5, 'orange', 'red');
    this.restartButton = new Button(50, 50, "Gameover! Tap anywhere to restart!", 5, 5, 'orange', 'red');
}
function drawButton(button) {
    context2D.fillStyle = button.borderColor;
    context2D.fillRect(button.x, button.y, 50, 50);

    context2D.strokeStyle = button.color;
    context2D.strokeText(button.text, button.x, button.y);
}

function drawHomeScreen() {
    setBackground('white');

    context2D.strokeStyle = 'orange';
    context2D.strokeText("The Floor Is ", (context2D.width - context2D.measureText("The floor Is ").width)/2, 15);
    context2D.strokeStyle = 'red';
    context2D.strokeText("LAVA", (context2D.width-context2D.measureText("LAVA").width)/2, 15+context2D.measureText("LAVA").width);
}

function renderScreen(screen) {
    if(screen == GAME_STATES.HOME) {
        drawHomeScreen();
    } else if(screen == GAME_STATES.IN_GAME) {
        drawLava();
        updateTimer();
        drawTimer();
    } else if(screen == GAME_STATES.GAME_OVER) {
        drawLava();
        drawTimer();
        drawButton(this.restartButton);
    }
}

function setBackground(color) {
    context2D.globalAlpha = 0.5;
    context2D.fillStyle = color;
    context2D.fillRect(0, 0, canvas.width, canvas.height);
}

function genSafeTiles(amount) {
    safeTileLocs = [];
    for(var i = 0; i < amount; i++) {
        var tileX = 0;
        var tileY = 0;
        while(tileX <= 0 || tileY <= 0) {
            tileX = (Math.floor(Math.random() * canvas.width / lavaBoxSize)-1) * lavaBoxSize + lavaBoxSize;
            tileY = (Math.floor(Math.random() * canvas.height / lavaBoxSize)-1) * lavaBoxSize + lavaBoxSize;
        }
        safeTileLocs.push([tileX, tileY]);

        context2D.globalAlpha = 1;
        context2D.fillStyle = safeColor;

        context2D.fillRect(tileX, tileY, lavaBoxSize, lavaBoxSize);
        floorTiles.push(new LavaTile(tileX, tileY, lavaBoxSize, safeColor, context2D.globalAlpha));
    }
    return safeTileLocs;
}

function drawLava() {
    if (floorTiles.length == 0) {
        lastLevelStartTime = globalTime;
        var safeTiles = genSafeTiles(Math.floor(Math.random() * maxSafeTiles) + 1);
        for (var x = 0; x < 192; x += lavaBoxSize) {
            for (var y = 0; y < 192; y += lavaBoxSize) {
                if(x == 0 && y == 0 || (!(x + lavaBoxSize >= lavaBoxSize) && !(y+lavaBoxSize >= lavaBoxSize))) {
                    continue;
                }
                var canDraw = true;
                for(var i = 0; i < safeTiles.length; i++) {
                    if(safeTiles[i][0] == x) {
                        if(safeTiles[i][1] == y) {
                            canDraw = false;
                            break;
                        }
                    }
                }

                if(canDraw) {
                    console.log(safeTiles.length);
                    if(safeTiles.length == 1)
                        console.log(safeTiles);
                    context2D.globalAlpha = 0.5;
                    context2D.fillStyle = lavaColors.random();
                    context2D.fillRect(x, y, lavaBoxSize, lavaBoxSize);
                    floorTiles.push(new LavaTile(x, y, lavaBoxSize, context2D.fillStyle, context2D.globalAlpha));
                }
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
    if(screen == GAME_STATES.IN_GAME) {
        isFire = false;
        level += 1;
        floorTiles = [];
        recalculateDifficulty();
    }
}

function recalculateDifficulty() {
    // TODO
    // Fix decaying function for seconds left
    secondWait = 3*Math.floor(Math.pow(Math.E, -0.01*level)) + 2;
    maxSafeTiles = Math.floor(maxSafeTiles/2) + 1;
    lavaBoxSize = lavaBoxSizes.random();
}

function drawTimer() {
    // TODO
    // Make timer & text reactive - same size as lavabox squares
    context2D.strokeStyle = 'yellow';
    context2D.strokeRect(0, 0, lavaBoxSize, lavaBoxSize);

    context2D.strokeStyle = 'yellow';
    context2D.font = '12px Comic Sans';
    context2D.strokeText('Time: ' + displayNumber, 0, 16, 32);
    context2D.strokeText('Level: ' + level, 0, 28, 32);
}

function updateTimer() {
    // Only use timer in game
    if(screen == GAME_STATES.IN_GAME) {
        var difference = globalTime-lastLevelStartTime;
        if(difference % 1000 == 0) {
            if(secondWait-(difference/1000) > -1) {
                displayNumber = secondWait-(difference/1000);
            }
        }

        // Check if difference = secondWait
        if(difference == secondWait*1000) {
            isFire = true;
            console.log("IS FIRE = TRUE");
        } else if(difference > secondWait*1000+2) {
            console.log("UPDATING LEVEL!");
            if(screen != GAME_STATES.HOME)
                nextLevel();
        }
    }

}

function acceptInput(x, y) {
    if(screen == GAME_STATES.HOME) {
        screen = GAME_STATES.IN_GAME;
        nextLevel();
    } else if(screen == GAME_STATES.IN_GAME) {
        if(isFire) {
            floorTiles.forEach(function (tile) {
                if (tile.isLava) {
                    if (tile.isOnTile(x, y)) {
                        tile.fillStyle = 'green';
                        gameOver();
                    }
                }
            });
        }
    }
    console.log("DONE EXECUTING!");
}

function gameOver() {
    screen = GAME_STATES.GAME_OVER;
    console.log("GAME OVER!");
}

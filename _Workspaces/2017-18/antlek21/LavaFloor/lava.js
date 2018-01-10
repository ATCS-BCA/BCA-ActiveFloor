/* Created By Anthony Lekan 01/10/18 */

var screen;
var score;

var buttons;
var lavaBoxSize;
const lavaColors = ['#ffff44', '#ff6600', '#cc4422', '#553333', '#eadab5'];
const safeColor = '#eadab5';

// Whether the lava boxes are active
var isFire;

const lavaTiles = [];

function LavaTile(x, y, boxSize, fillStyle) {
    this.x = x;
    this.y = y;
    this.boxSize = boxSize;
    this.fillStyle = fillStyle;
    if(fillStyle == safeColor) {
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
    isFire = true;

    initButtons();
    renderScreen(screen);
}

var button = function() {

};

function initButtons() {

}

function renderScreen(screen) {
    if(screen == 0) {
        
    } else if(screen == 1) {
        drawLava();
    } else {

    }
}

function drawLava() {
    if(screen == 1) {
        if (lavaTiles.length == 0) {
            for (var x = 0; x < 192; x += lavaBoxSize) {
                for (var y = 0; y < 192; y += lavaBoxSize) {
                    context2D.globalAlpha = 0.5;
                    context2D.fillStyle = lavaColors.random();
                    context2D.fillRect(x, y, lavaBoxSize, lavaBoxSize);
                    lavaTiles.push(new LavaTile(x, y, lavaBoxSize, context2D.fillStyle));
                }
            }
        } else {
            lavaTiles.forEach(function (tile) {
                context2D.globalAlpha = 0.4;
                context2D.fillStyle = tile.fillStyle;
                context2D.fillRect(tile.x, tile.y, tile.boxSize, tile.boxSize);
            });
        }
    }
}

function acceptInput(x, y) {

    if(screen == 0) {
        
    } else if(screen == 1) {
        if(isFire) {
            lavaTiles.forEach(function(tile) {
               if(tile.isLava()) {
                   if(tile.x == x || (tile.x < x && tile.x + tile.boxSize >= x)) {
                       if(tile.y == y || (tile.y < y && tile.y + tile.boxSize >= y)) {
                           gameOver();
                       }
                   }
               } 
            });
        }
    } else {
        
    }
}

function gameOver() {
    context2D.globalAlpha = 0.5;
    context2D.fillStyle = 'red';
    context2D.fillRect(0, 0, canvas.width, canvas.height);
    screen = 2;
}

/* Created By Anthony Lekan 01/10/18 */

var screen;
var score;

var buttons;

var lavaColors = ['#ffff44', '#ff6600', '#cc4422', '#553333'];

Array.prototype.random = function() {
  return this[Math.floor(Math.random() * this.length)];
};

// Create All buttons
// Inits canvas screen
function start() {
    screen = 0;
    score = 0;
    buttons = [];

    initButtons();
    renderScreen(screen);
}

var button = function() {

};

function initButtons() {

}

function renderScreen(screen) {
    if(screen == 0) {

        for(var x = 0; x < 192; x+=4) {
            for(var y = 0; y < 192; y+=4) {
                context2D.fillStyle = lavaColors.random();
                context2D.fillRect(x, y, 4, 4);
            }
        }
    } else if(screen == 1) {

    } else {

    }
}

function acceptInput(x, y) {

}

canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
active = false;
game = true;
score = 0;
var color;
first = true;

// this is all that happens when the window is loaded up
window.onload = function() {
    // Initialize the matrix.
    // create array with empty map[0], map[1], map[2]
    map = new Array(3);
    // this does: map[0] is an array with empty map[0][0], map [0][1], map [0][2]
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(3);
    }

    canvas.width=192;
    canvas.height=192;

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);

    // begins empty array for color sequence
    var a = newArray();
    // score is already set to 0
    a[0] = numbercolor(Math.floor((Math.random()*5)+1));

    // begins empty array for player step sequence (gets rewritten each round)
    var playerSteps = new Array()

    drawGame();

    function drawGame() {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        // Fill everything with black color
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // create the grid outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.beginPath();
        // draw the vertical 1st line
        // start at row 64, column 0
        ctx.moveTo(64,0);
        // end line at same row, but column 192
        ctx.lineTo(64,192);
        // draw the vertical 2nd line
        ctx.moveTo(128,0);
        ctx.lineTo(128,192);
        // draw the horizontal 1st line
        ctx.moveTo(0,64);
        ctx.lineTo(192,64);
        // draw the horizontal 2nd line
        ctx.moveTo(0,128);
        ctx.lineTo(192,128);
        // show the lines
        ctx.stroke();

        // dark red
        ctx.fillStyle = '#c0392b';
        ctx.fillRect(0, 0, 64, 64);
        // dark orange
        ctx.fillStyle = '#d35400';
        ctx.fillRect(64, 0, 64, 64);
        // dark yellow
        ctx.fillStyle = '#f39c12';
        ctx.fillRect(128, 0, 64, 64);
        // dark green
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(0, 64, 64, 64);
        // dark blue
        ctx.fillStyle = '#2980b9';
        ctx.fillRect(128, 64, 64, 64);
        // dark bluegreen
        ctx.fillStyle = '#16a085';
        ctx.fillRect(0, 128, 64, 64);
        // dark purple
        ctx.fillStyle = '#8e44ad';
        ctx.fillRect(64, 128, 64, 64);
        // dark pink
        ctx.fillStyle = 'd90d36';
        ctx.fillRect(128, 128, 64, 64);

        drawScore();

        while (game != false) {
          playColor();

          playerTurn();

          // after each round, if game not over (game != false), call function "addColor()"
          addColor();
        }
    }

    if (first) {
        setTimeout(function() { first=false; }, 3000);
    }

    if (game) setTimeout(showGameOver,1000);
    if (!game) setTimeout(drawGame,1000/60);
}

// shows the score in the middle box
function drawScore() {
    ctx.lineWidth = 2;
    ctx.strokeStyle = 'red';
    ctx.strokeRect(1, 1, canvas.width-2, canvas.height-2);

    ctx.fillStyle = 'red';
    ctx.font = '12px sans-serif';
    ctx.fillText('Score: ' + score, ((canvas.width / 2) - (ctx.measureText('Score: ' + score).width / 2)), 90);
}

// here shows the sequence of colors
function playColor() {
  // for every color, indexed by score, board area lights up
  for (sequence = 0; sequence <= score; sequence++) {
    // sets variable "color" to the right color that needs to show
    numbercolor(a[sequence]);
    // light up that color variable
    showColor();
  }
}

// when you put in an array d, index e...
// this sets the colors from the number
function numbercolor(d[e]) {
  // light red
  if (d[e]=1) color = "#e74c3c";
  // light orange
  else if (d[e]=2) color = "#e67e22";
  // light yellow
  else if (d[e]=3) color = "#f1c40f";
  // light green
  else if (d[e]=4) color = "#2ecc71";
  // light bluegreen
  else if (d[e]=5) color = "#1abc9c";
  // light blue
  else if (d[e]=6) color = "#3498db";
  // light purple
  else if (d[e]=7) color = "#9b59b6";
  // light pink
  else color = "#ff355e";
}

// displays colors
function showColor() {
  // make new box (light color) cover box (first dark color)
  ctx.fillStyle = color;
  // shows rectangle for 3000 milliseconds
  setTimeout(ctx.fillRect(i*64, j*64, 64, 64), 3000);
}

// player's turn to copy the sequence
function playerTurn() {
  for (step = 0; step < a.length; step++) {
    while (game = true) {
      active = true;
      // the next thing (number? color?) the player steps on becomes stored as a[step]
      function press(a,b) {
          // if not first (so first == false),
          if(!first) map[b][a] = a[step];
      }
      // also SHOW the color that was stepped on!!
      // sets variable "color" to the right color that needs to show
      numbercolor(a[step]);
      showColor()

      // if the player steps incorrectly, game over
      if (playerSteps[step] != a[step]) {
        game = false;
      }
    }
  }
}

// this function is used after every round (that the game is still going)
// it adds a randomly generated color to the sequence
function addColor() {
  // player cannot step now temporarily
  active = false;
  // increase the score...
  score++;
  // for next level, assigns random color from 1 to 8
  a[score] = Math.floor((Math.random()*5)+1);
  numbercolor();
}

function showGameOver() {
    // Disable the game.
    active = false;

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = 'red';
    ctx.font = '16px sans-serif';

    ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);

    ctx.font = '12px sans-serif';

    ctx.fillText('Your Score Was: ' + score, ((canvas.width / 2) - (ctx.measureText('Your Score Was: ' + score).width / 2)), 70);

    ctx.fillRect((canvas.width - ctx.measureText('Stand here to restart').width)/2-1, 86, ctx.measureText('Stand here to restart').width+3, 10+3);

    ctx.fillStyle = 'black';
    ctx.fillText('Stand here to restart', (canvas.width - ctx.measureText('Stand here to restart').width)/2, 192/2);
}

String.prototype.replaceAll = function(str1, str2, ignore) {
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}

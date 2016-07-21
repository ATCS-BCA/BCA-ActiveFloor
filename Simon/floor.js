/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;
var pressed;

function refreshXML() {
    'use strict';
    // change IP address to match ActiveFloor server address
    $.get('http://10.31.33.66:8080/', function (data) {
        dataHolderArray = [];

        $(data).find('BLFloor').each(function () {
            $item = $(this);
            ledsX = $item.attr('ledsX');
            ledsY = $item.attr('ledsY');
            sensorsX = $item.attr('sensorsX');
            sensorsY = $item.attr('sensorsY');
            ledPerSensorX = (ledsX / sensorsX);
            ledPerSensorY = (ledsY / sensorsY);
            xCenter = ledPerSensorX / 2;
            yCenter = ledPerSensorY / 2;
        });

        $(data).find('Row').each(function () {
            var $row, rowNum, rowVal, n;
            $row = $(this);
            rowNum = $row.attr('rownum');
            rowVal = $row.attr('values');
            n = rowVal.split(charDivide).join('');

            dataHolderArray.push(n);
        });
        drawCanvas(dataHolderArray);
    });
}

// restart the game? when active is false
function refresh() {
    // active is like when on/off... right now, "false" is off. so when active == false,
    if (active == false) {
        // there is a variable that creates an element "a"
        var a = document.createElement('a');
        a.id = "restart";
        a.title = "Restart";
        a.href = "tictactoe.html";
        document.body.appendChild(a);

        document.getElementById('restart').click();
        done = false;
    }
}

// put in an array "arr" to draw canvas
function drawCanvas(arr) {
    'use strict';

    var i, tempRow, j, srchStr;
    // first, for every variable "i" going from 0 to the length of the array,
    for (i = 0; i < arr.length; i++) {
        tempRow = arr[i];
        // there's another variable "j" going from 0 to the same length of the array
        for (j = 0; j < tempRow.length; j++) {
            srchStr = tempRow.substring(j, j + 1);
            if (srchStr === charSearch) {
                if (i < 8 && j < 8) pressed = 1;
                else if (i > 8 && i < 16 && j < 8) pressed = 2;
                else if (i > 16 && j < 8) pressed = 3;
                else if (i > 16 && j > 8 && j < 16) pressed = 4;
                else if (i > 16 && j > 16) pressed = 5;
                else if (i > 8 && i < 16 && j > 16) pressed = 6;
                else if (i < 8 && j > 16) pressed = 7;
                else if (i < 8 && j > 8 && j < 16) pressed = 8;
                else pressed = 0;
            }
        }
    }
    drawGame();
}

function Restart(){
    done = true;
}

$(document).ready(function () {
    'use strict';

    // Start getting floor data automatically (assuming Floor Server is running).
    startRefresh();

    sendSemaphore(function() {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");
    });
});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {refreshXML(); }, refreshTime);
}

function stopRefresh() {
    'use strict';
    clearInterval(myInterval);
}

canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
active = false;
game = true;
score = 0;
var color;
first = true;
timer = 3000;
seq = 0;

// begins empty array for player step sequence (gets rewritten each round)
playerSteps = new Array();

var cells = [
  "",
  {"lightColor": "#e74c3c", "x":2, "y":2},
  {"lightColor": "#e67e22", "x":66, "y":2},
  {"lightColor": "#f1c40f", "x":130, "y":2},
  {"lightColor": "#2ecc71", "x":130, "y":66},
  {"lightColor": "#1abc9c", "x":130, "y":130},
  {"lightColor": "#3498db", "x":66, "y":130},
  {"lightColor": "#9b59b6", "x":2, "y":130},
  {"lightColor": "#ff355e", "x":2, "y":66}
];

/*
var cells = [
  "",
  {"lightColor": "black", "x":2, "y":2},
  {"lightColor": "black", "x":66, "y":2},
  {"lightColor": "black", "x":130, "y":2},
  {"lightColor": "black", "x":130, "y":66},
  {"lightColor": "black", "x":130, "y":130},
  {"lightColor": "black", "x":66, "y":130},
  {"lightColor": "black", "x":2, "y":130},
  {"lightColor": "black", "x":2, "y":66}
];
*/

// begins empty array for color sequence
var a = new Array();

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

    // score is already set to 0
    a[0] = Math.floor((Math.random()*8)+1);
    a[1] = Math.floor((Math.random()*8)+1);
    a[2] = Math.floor((Math.random()*8)+1);
    a[3] = Math.floor((Math.random()*8)+1);
    a[4] = Math.floor((Math.random()*8)+1);
    a[5] = Math.floor((Math.random()*8)+1);

/*  if (first) {
        setTimeout(function() { first=false; }, 3000);
    }

    if (game) setTimeout(showGameOver,1000);
    if (!game) setTimeout(drawGame,1000/60);
*/
}

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

    // dark red - 1
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(0+2, 0+2, 60, 60);
    // dark orange - 2
    ctx.fillStyle = '#d35400';
    ctx.fillRect(64+2, 0+2, 60, 60);
    // dark yellow - 3
    ctx.fillStyle = '#f39c12';
    ctx.fillRect(128+2, 0+2, 60, 60);
    // dark green - 4
    ctx.fillStyle = '#27ae60';
    ctx.fillRect(128+2, 64+2, 60, 60);
    // dark bluegreen - 6
    ctx.fillStyle = '#16a085';
    ctx.fillRect(128+2, 128+2, 60, 60);
    // dark blue - 5
    ctx.fillStyle = '#2980b9';
    ctx.fillRect(64+2, 128+2, 60, 60);
    // dark purple - 7
    ctx.fillStyle = '#8e44ad';
    ctx.fillRect(0+2, 128+2, 60, 60);
    // dark pink - 8
    ctx.fillStyle = 'd90d36';
    ctx.fillRect(0+2, 64+2, 60, 60);

    drawScore();

    if (game != false) {
      if (seq <= 5) {
        // light up that color variable
        cell = cells[a[seq]];
        ctx.fillStyle = cell["lightColor"];
        ctx.fillRect(cell["x"], cell["y"], 60, 60);
        while (timer > 0) {
          timer -= refreshTime;
        }
        if (timer <= 0) {
          seq++;
          timer = 3000;
        }
      }

/*    playColor(a);
      playerTurn(playerSteps, a);

      // after each round, if game not over (game != false), call function "addColor()"
      addColor();
*/
    }
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
function playColor(a) {
  // for every color, indexed by score, board area lights up
  for (sequence = 0; sequence <= score; sequence++) {
    // light up that color variable
    cell = cells[a[sequence]];
    ctx.fillStyle = cell["lightColor"];
    ctx.fillRect(cell["x"], cell["y"], 60, 60);
  }
}

// player's turn to copy the sequence
function playerTurn(b, a) {
  for (step = 0; step < a.length; step++) {
    if (game == true) {
      active = true;
      // the next thing (number? color?) the player steps on becomes stored as a[step]
      if (pressed != 0) {
        a[step] = pressed;
      }
      // also SHOW the color that was stepped on!!
      // sets variable "color" to the right color that needs to show
      numbercolor(a[step]);
      showColor();

      // if the player steps incorrectly, game over
      if (b[step] != a[step]) {
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
  a[score] = Math.floor((Math.random()*8)+1);
  numbercolor(a[score]);
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

/*jslint browser: true*/
/*global $, jQuery*/

/*
problems:
- first move should be in any square
- when one tic-tac-toe board is won it should let the player choose any open square on the board
- game does not end when player wins 3 boards in a row
 */

var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 1000/60;
var lasti=1;
var lastj=1;
active = true;
var wonBoards = [
    "","","",
    "","","",
    "","",""
];
var activeBoards = [
    true, true, true,
    true, true, true,
    true, true, true
];
player=0;
win=false;

window.onload = function()
{
    // Initialize the matrix.
    map = new Array(9);
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(9);
    }

    canvas = document.getElementById('floorCanvas');
    canvas.width = 192;
    canvas.height = 192;
    ctx = canvas.getContext('2d');

    drawGame();

    function drawGame()
    {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //Creates the tic tac toe boards in each of the spots in the main one
        ctx.strokeStyle = 'blue';
        ctx.lineWidth = 1;

        ctx.beginPath();
        for (var j = 24; j <=120; j+=48){
            for (var i = (48 / 3); i <= (120 / 3); i += (48 / 3)) {
                ctx.moveTo(j, 24+i);
                ctx.lineTo(j+48, 24+i);
                ctx.moveTo(j+i, 24);
                ctx.lineTo(j+i, 72);
                ctx.moveTo(j, i + 72);
                ctx.lineTo(j+48, i + 72);
                ctx.moveTo(j+i, 72);
                ctx.lineTo(j+i, 120);
                ctx.moveTo(j, 168 - i);
                ctx.lineTo(j+48, 168 - i);
                ctx.moveTo(j+i, 120);
                ctx.lineTo(j+i, 168);
            }
        }

        ctx.stroke();

        //Creates the main tic tac toe board
        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;

        ctx.beginPath();
        for (var i =72; i <=120; i+=48){
            ctx.moveTo(i, 24);
            ctx.lineTo(i,168);
            ctx.moveTo(24,i);
            ctx.lineTo(168,i);
        }
        ctx.stroke();

        drawMain();


        ctx.lineWidth = 1;
        ctx.strokeStyle = 'white';
        //ctx.beginPath();

        for (var h=0; h<9 && !win; h+=3) {
            for (var i = 0; i < 9 && !win; i++) {
                if (!win && map[i][h] != -1 && map[i][h] == map[i][h + 1] && map[i][h + 1] == map[i][h + 2]) {
                    ctx.beginPath();
                    ctx.moveTo(i * 16 + 8 + 24, h * 16 + 4 + 24);
                    ctx.lineTo(i * 16 + 8 + 24, h * 16 + 44 + 24);
                    win = true;
                    ctx.stroke();
                }

                if (!win && map[h][i] != -1 && map[h][i] == map[h + 1][i] && map[h + 1][i] == map[h + 2][i]) {
                    ctx.beginPath();
                    ctx.moveTo(h * 16 + 4 + 24, i * 16 + 8 + 24);
                    ctx.lineTo(h * 16 + 44 + 24, i * 16 + 8 + 24);
                    //win = true;
                    ctx.stroke();
                }
            }
            for (var j = 0; j < 9 && !win; j+=3) {
                if (!win && map[h][j] != -1 && map[h][j] == map[h+1][j+1] && map[h+1][j+1] == map[h+2][j+2]) {
                    ctx.beginPath();
                    ctx.moveTo(h * 16 + 4 + 24, j * 16 + 4 + 24);
                    ctx.lineTo(h * 16 + 44 + 24, j * 16 + 44 + 24);
                    win = true;
                    ctx.stroke();
                }
                if (!win && map[h][j+2] != -1 && map[h][j+2] == map[h+1][j+1] && map[h+1][j+1] == map[h+2][j]) {
                    ctx.beginPath();
                    ctx.moveTo(h * 16 + 44 + 24, j * 16 + 4 + 24);
                    ctx.lineTo(h * 16 + 4 + 24, j * 16 + 44 + 24);
                    //win = true;
                    ctx.stroke();
                }
            }
        }
        //ctx.stroke();




        if (win) setTimeout(showGameOver,1000);
        if (!win) setTimeout(drawGame,1000/60);
    }
}

function drawMain() {
    var allFull=true;
        for (var i = 0; i < 9 ; i++) {
            for (var j = 0; j < 9 ; j++) {
                if (map[i][j] == 0) {
                    ctx.beginPath();
                    ctx.moveTo(16 * i + 8 / 3 + 24, 16 * j + 8 / 3 + 24);
                    ctx.lineTo(16 * i + 14 + 24, 16 * j + 14 + 24);
                    ctx.moveTo(16 * i + 14 + 24, 16 * j + 8 / 3 + 24);
                    ctx.lineTo(16 * i + 8 / 3 + 24, 16 * j + 14 + 24);
                    ctx.stroke();

                } else if (map[i][j] == 1) {
                    ctx.beginPath();
                    ctx.arc(16 * i + 8 + 24, 16 * j + 8 + 24, 6, 0, 2 * Math.PI);
                    ctx.stroke();
                } else {
                    map[i][j] = -1;
                    allFull = false;
                }
            }
        }
    if (allFull) win=true;
}


function press(a,b){
    if (map[b][a]==-1){
        map[b][a]=player;
        player=1-player;
    }
}

function showGameOver() {

    ctx.lineWidth = 2;
    active = false;

    ctx.fillStyle = 'green';
    ctx.font = '16px sans-serif';

    ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);

    ctx.font = '12px sans-serif';


    ctx.fillRect((canvas.width - ctx.measureText('Stand here to restart').width) / 2 - 1, 86, ctx.measureText('Stand here to restart').width + 3, 10 + 3);

    ctx.fillStyle = 'white';
    ctx.fillText('Stand here to restart', (canvas.width - ctx.measureText('Stand here to restart').width) / 2, 192 / 2);


    if (win) setTimeout(showGameOver, 1000 / 60);
}

String.prototype.replaceAll = function(str1, str2, ignore)
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
}


function refresh(){
    if(active == false){
        var a = document.createElement('a');
        a.id="restart";
        a.title = "Restart";
        a.href = "tictactoe.html";
        document.body.appendChild(a);
        

        document.getElementById('restart').click();
        done=false;

    }
}

function initCanvas(arr) {
    'use strict';
    var middle=0;

    for (var i=3;i<arr.length-3;i++){
        for (var j=3;j<arr[i].length-3;j++){

            if (arr[i][j]==="*"){
//                if (i>=2 && i<=22 && j>=9 && j<=15)
//                    middle++;
//                press(Math.floor((i-3)/2),Math.floor((j-3)/2));
                console.log ("i=" + i + "; j=" + j);
                var pos_i = Math.floor((i - 3) / 2);
                var pos_j = Math.floor((j - 3) / 2);
                console.log ("pos_i=" + pos_i);
                console.log ("pos_j=" + pos_j);
                console.log ("lasti=" + lasti);
                console.log ("lastj=" + lastj);

              if((Math.floor(pos_i/3) == lasti) && (Math.floor(pos_j/3) == lastj)){
                    press(pos_i, pos_j);
                    lasti = pos_i%3;
                    lastj = pos_j%3;
                }
            }
        }
    }

//    if (middle>2) refresh();

}

function refreshXML() {
    'use strict';
	// change IP address to match ActiveFloor server address
    $.get('http://activefloor.bca.bergen.org:8080//', function (data) {
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
			
        initCanvas(dataHolderArray);
    });
}

$(document).ready(function () {
    'use strict';
    startRefresh();
});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {refreshXML(); }, refreshTime);
}
//

$(document).ready(function () {
    'use strict';
    startRefresh();
    
    sendSemaphore(function() {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");
    });
});
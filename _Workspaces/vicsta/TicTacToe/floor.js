/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 1000/60;

active = true;
player=0;
win=false;
first=true;

window.onload = function()
{

    // Initialize the matrix.
    map = new Array(3);
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(3);
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
        ctx.beginPath();

        for (var i=0;i<3 && !win;i++){
            if (!win && map[i][0]!=-1 && map[i][0]==map[i][1] && map[i][1]==map[i][2]){
                ctx.moveTo(i*64+32,16);
                ctx.lineTo(i*64+32,176);
                win=true;
            }
            if (!win && map[0][i]!=-1 && map[0][i]==map[1][i] && map[1][i]==map[2][i]){
                ctx.moveTo(16,i*64+32);
                ctx.lineTo(176,i*64+32);
                win=true;
            }
        }
        if (!win && map[0][0]!=-1 && map[0][0]==map[1][1] && map[1][1]==map[2][2]){
            ctx.moveTo(16,16);
            ctx.lineTo(176,176);
            win=true;
        }
        if (!win && map[0][2]!=-1 && map[0][2]==map[1][1] && map[1][1]==map[2][0]){
            ctx.moveTo(176,16);
            ctx.lineTo(16,176);
            win=true;
        }

        ctx.stroke();


        if (first){
            setTimeout(function(){ first=false; }, 3000);
        }

        if (win) setTimeout(showGameOver,1000);
        if (!win) setTimeout(drawGame,1000/60);
    }
}

function drawMain() {
    var allFull=true;
    for (var i=0;i<3;i++){
        for (var j=0;j<3;j++){
            if (map[i][j]==0){
                ctx.beginPath();
                ctx.moveTo(48*i+8+24,48*j+8+24);
                ctx.lineTo(48*i+42+24,48*j+42+24);
                ctx.moveTo(48*i+42+24,48*j+8+24);
                ctx.lineTo(48*i+8+24,48*j+42+24);
                ctx.stroke();
            }else if (map[i][j]==1){
                ctx.beginPath();
                ctx.arc(48*i+24+24,48*j+24+24, 18, 0, 2 * Math.PI);
                ctx.stroke();
            }else{
                map[i][j]=-1;
                allFull=false;
            }
        }
    }
    if (allFull) win=true;
}


function press(a,b){
    if (!first && map[b][a]==-1){
        map[b][a]=player;
        player=1-player;
    }
}

function showGameOver()
{

    ctx.lineWidth = 2;
    active = false;

    ctx.fillStyle = 'red';
    ctx.font = '16px sans-serif';

    ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);

    ctx.font = '12px sans-serif';


    ctx.fillRect((canvas.width - ctx.measureText('Stand here to restart').width)/2-1, 86, ctx.measureText('Stand here to restart').width+3, 10+3);

    ctx.fillStyle = 'black';
    ctx.fillText('Stand here to restart', (canvas.width - ctx.measureText('Stand here to restart').width)/2, 192/2);


    if (win) setTimeout(showGameOver,1000/60);
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

    for (var i=0;i<arr.length;i++){
        for (var j=0;j<arr[i].length;j++){

            if (arr[i][j]==="*"){
                if (i>=8 && i<=16 && j>=8 && j<=16) middle++;
                press(Math.floor(i/8),Math.floor(j/8));
            }
        }
    }

    if (middle>2) refresh();

}

function refreshXML() {
    'use strict';
	// change IP address to match ActiveFloor server address
    $.get('http://168.229.106.80:8080/', function (data) {
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
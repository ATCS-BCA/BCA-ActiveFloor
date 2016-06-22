var score = 0;
var active = true;
var speed = 3;
var level = 0;
var size = 10;
var script;
var game = -1;
var over = false;
var survivalBtn, restartBtn;
var intervals = [];
var firstRun = true;
var contact = false;
var screen = 0;

//
// Start Menu
//
function menu(){
	screen = 0;
	clear();
	active = true;
	balls = [];

	context2D.fillStyle = '#2ecc71';
    context2D.font = '24px sans-serif';
    
    context2D.fillText('DODGEBALL', ((canvas.width / 2) - 
    	(context2D.measureText('DODGEBALL').width / 2)), 50);

	context2D.fillStyle = survivalBtn.fillColor;

    context2D.font = '12px sans-serif';

    context2D.strokeStyle = survivalBtn.strokeColor;
    context2D.fillStyle = survivalBtn.fillColor;
    context2D.fillText(survivalBtn.string, 
    	survivalBtn.x, survivalBtn.y);
	context2D.strokeRect(survivalBtn.bx, survivalBtn.by, survivalBtn.bw, survivalBtn.bh);

    context2D.strokeStyle = laserBtn.strokeColor;
    context2D.fillStyle = laserBtn.fillColor;
    context2D.fillText(laserBtn.string, 
    	laserBtn.x, laserBtn.y);
	context2D.strokeRect(laserBtn.bx, laserBtn.by, laserBtn.bw, laserBtn.bh);

    setTimeout(
    intervals.push(setInterval(function(){
    	if (game != -1){
    		clearIntervals();
    		chooseMode();
    	}
    }, 10)), 1000);
}

//
// 
//
function chooseMode(){
	var head = document.getElementsByTagName('head')[0];
	script = document.createElement("script");
	script.type = "text/javascript";
	script.onload = function() {
		start();
	}
	if (game == 0){//survival
		script.src = survivalBtn.file;
	} else if (game == 1){//laser
		script.src = laserBtn.file;
	}
	head.appendChild(script);
}

//
// 
//
function removeMode(){
	script.parentNode.removeChild(script)
}

//
// Clear the screen
//
function clear(){
	context2D.clearRect(0,0,canvas.width, canvas.height);
}

//
// clear all the events running
//
function clearIntervals(){
	for (var i = 0; i < intervals.length; i++)
		clearInterval(intervals[i]);

	intervals = [];
}

//
// Show gameOver screen
//
function gameOver(){
	screen = 3;
	clearIntervals();

	context2D.fillStyle = 'red';
    context2D.font = '24px sans-serif';
    
    context2D.fillText('Game Over!', ((canvas.width / 2) - (context2D.measureText('Game Over!').width / 2)), 50);

    context2D.font = '12px sans-serif';
    context2D.fillText('Your Score Was: ' + score, 
    	((canvas.width / 2) - (context2D.measureText('Your Score Was: ' + score).width / 2)), 70);
    
    context2D.fillStyle = restartBtn.fillColor;
    context2D.strokeStyle = restartBtn.strokeColor;
    context2D.fillText(restartBtn.string, restartBtn.x, restartBtn.y);
    context2D.strokeRect(restartBtn.bx, restartBtn.by, restartBtn.bw, restartBtn.bh);

	game = -1;
}

//
// get Random number from min to max inclusive
//
function getRandomIntInclusive(min, max) {
	x = Math.floor(Math.random() * (max - min + 1)) + min;
	if (x == 0)
		x = getRandomIntInclusive(min, max);
	return x;
}

//
// Returns a random number between min (inclusive) and max (exclusive)
//
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

//
// Check if player coordinates are inside a ball
//
function checkPlayerHit(x, y){
	for (var i = 0; i < balls.length; i++){
		if (Math.pow(x - balls[i].nextX, 2) + Math.pow(y - balls[i].nextY, 2)
			<= Math.pow(balls[i].radius, 2)){
			active = false;
			game = -1;
		}
	}
}

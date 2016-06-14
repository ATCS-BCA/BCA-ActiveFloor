var score = 0;
var active = true;
var speed = 3;
var level = 0;
var size = 10;
var prodPause = 7;
var game = false;
var balls = [];
var over = false;
var startBtn, restartBtn;
var intervals = [];
var spawner;
var firstRun = true;
var contact = false;
var screen = 0;
var spawnTimer;

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

	context2D.fillStyle = '#e67e22';

    context2D.font = '12px sans-serif';
    context2D.strokeStyle = 'blue';
    context2D.fillText('Start', 
    	startBtn.x, startBtn.y);
	context2D.strokeRect(startBtn.bx, startBtn.by, startBtn.bw, startBtn.bh);

    setTimeout(
    intervals.push(setInterval(function(){
    	if (game){
    		clearIntervals();
    		start();
    	}
    }, 10)), 1000);
}

//
// Clear the screen
//
function clear(){
	context2D.clearRect(0,0,canvas.width, canvas.height);
}

//
// Draw the board (AKA the spawner)
//
function board(){
	context2D.strokeStyle = '#3498db';
	context2D.beginPath();
	context2D.arc(spawner.x, spawner.y, spawner.radius, 0, Math.PI * 2);
	context2D.stroke();
	spawnTime();
	context2D.closePath();
}

function spawnTime(){
	context2D.fillStyle = 'white';
	context2D.fillText(spawnTimer, spawner.x - context2D.measureText(spawnTimer).width / 2, spawner.y  + 5);
}

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
    
    context2D.strokeStyle = '#3498db';
    context2D.fillText('Restart', restartBtn.x, restartBtn.y);
    context2D.strokeRect(restartBtn.bx, restartBtn.by, restartBtn.bw, restartBtn.bh);

	game = false;


	// intervals.push(setInterval(function(){
 //    	if(over){
 //    		clear();
 //    		menu();
 //    	}
 //    }, 10));
}


function getRandomIntInclusive(min, max) {
	x = Math.floor(Math.random() * (max - min + 1)) + min;
	if (x == 0)
		x = getRandomIntInclusive(min, max);
	return x;
}

//
// Make a ball object
//
function Ball(speed, size){
	this.dx = getRandomIntInclusive(speed - 2, speed + 2)*3/16;
	this.dy = getRandomIntInclusive(speed - 2, speed + 2)*3/16;

	if (Math.floor(Math.random() * 2) == 0)
		this.dx *= -1;
	if (Math.floor(Math.random() * 2) == 0)
		this.dy *= -1;

	this.radius = size;
	this.mass = Math.pow(this.radius, 2);
	
	this.x = canvas.width/2;
	this.nextX = this.x;
	this.y = canvas.height/2;
	this.nextY = this.y;
	
	this.speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy,2));
	this.direction = Math.atan2(this.dy, this.dx);

	this.spawn = false;
}

//
// Check the wall collision and update
//
Ball.prototype.checkWallCollision = function(){

	//move the ball
	if (this.nextX + this.radius > canvas.width){
		this.dx *= -1;
		this.nextX = canvas.width - this.radius;
	}else if (this.nextX - this.radius < 0){
		this.dx *= -1;
		this.nextX = this.radius;
	}else if (this.nextY + this.radius > canvas.height){
		this.dy *= -1;
		this.nextY = canvas.height - this.radius;
	}else if (this.nextY - this.radius < 0){
		this.dy *= -1;
		this.nextY = this.radius;
	}
};

//
// Draw the ball
//
Ball.prototype.render = function(){
	this.x = this.nextX;
	this.y = this.nextY;

	context2D.beginPath();
	context2D.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
	context2D.closePath();

	context2D.fillStyle = '#e74c3c';
	context2D.fill();

};

//
// update the speed
//
Ball.prototype.updateInfo = function(){
	this.speed = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy,2));
	this.direction = Math.atan2(this.dy, this.dx);
};


//
// add the ball to the array
//
function addBall(speed, size){
	balls.push(new Ball(speed, size));
	score++;
}

//
// Check if two balls collide
//
function checkBallCollision(b1, b2){
	if (Math.sqrt(Math.pow(b1.nextX - b2.nextX, 2) + Math.pow(b1.nextY - b2.nextY, 2)) <= b1.radius + b2.radius)
		return true;
	else
		return false;
}

//
// Check if ball collides with the spawner
//
function checkSpawnCollision(b){
	if (Math.sqrt(Math.pow(b.nextX - spawner.x, 2) + Math.pow(b.nextY - spawner.y, 2)) 
		<= b.radius + spawner.radius)
		return true;
	else
		return false;
}

//
// If it collides, change the ball direction and speed
//
function updateCol(b1, b2){
	var collisionAngle = Math.atan2(b1.nextY - b2.nextY, b1.nextX - b2.nextX)
	b1.updateInfo();
	b2.updateInfo();


	var dx1 = b1.speed * Math.cos(b1.direction - collisionAngle);
	var dx2 = b2.speed * Math.cos(b2.direction - collisionAngle);

	var dy1 = b1.speed * Math.sin(b1.direction - collisionAngle);
	var dy2 = b2.speed * Math.sin(b2.direction - collisionAngle);

	var final_dx1 = ((b1.mass - b2.mass) * dx1 + 2 * b2.mass * dx2)
		/(b1.mass + b2.mass);
	var final_dx2 = ((b2.mass - b1.mass) * dx2 + 2 * b1.mass * dx1)/(b1.mass + b2.mass);
	var final_dy1 = dy1;
	var final_dy2 = dy2;
	b1.dx = Math.cos(collisionAngle) * final_dx1 + 
		Math.cos(collisionAngle + Math.PI/2) * final_dy1;
	b2.dx = Math.cos(collisionAngle) * final_dx2 + 
		Math.cos(collisionAngle + Math.PI/2) * final_dy2;
	b1.dy = Math.sin(collisionAngle) * final_dx1 + 
		Math.sin(collisionAngle + Math.PI/2) * final_dy1;
	b2.dy = Math.sin(collisionAngle) * final_dx2 + 
		Math.sin(collisionAngle + Math.PI/2) * final_dy2;

	// b1.nextX += b1.dx;
	// b2.nextX += b2.dx;

	// b1.nextY += b1.dy;
	// b2.nextY += b2.dy;
}

function updateSpawnCollision(b1, b2){
	// var scalar = (2*(b.dx * (b.x - canvas.width/2) + b.dy * (b.y - canvas.height/2)))
	// 		/(Math.pow((b.x - canvas.width/2),2) + Math.pow((b.y - canvas.heigth/2), 2));

	// var dx = b.dx - scalar * (b.x - canvas.width/2);
	// var dy = b.dy - scalar * (b.y - canvas.height/2);

	// var dx = b.nextX - spawnRadius;
	// var dy = b.nextY - spawnRadius;

	// var speed = Math.sqrt(Math.pow(b.nextX, 2) + Math.pow(b.nextY, 2));

	// var angle = Math.atan2(-dy,dx);
	// var oldAngle = Math.atan2(-b.dy,b.dx);
	// var newAngle = 2 * angle - oldAngle;
	// b.dx = -speed * Math.cos(newAngle);
	// b.dy = -speed * Math.sin(newAngle);
	var collisionAngle = Math.atan2(b1.nextY - b2.nextY, b1.nextX - b2.nextX)
	b1.updateInfo();


	var dx1 = b1.speed * Math.cos(b1.direction - collisionAngle);
	var dy1 = b1.speed * Math.sin(b1.direction - collisionAngle);

	var final_dx1 = ((b1.mass - b2.mass) * dx1)
		/(b1.mass + b2.mass);
	var final_dy1 = dy1;

	b1.dx = Math.cos(collisionAngle) * final_dx1 + 
		Math.cos(collisionAngle + Math.PI/2) * final_dy1;
	b1.dy = Math.sin(collisionAngle) * final_dx1 + 
		Math.sin(collisionAngle + Math.PI/2) * final_dy1;
}

//
// animate the balls
//
function animate(){
	'use strict';
	if (active == false){
		clear();
		game = false;
		over = true;
		gameOver();
		return;
	}else{
		over = false;
		game = true;
	}

	//update
	for (var i = 0; i < balls.length; i++){
		balls[i].nextX = balls[i].x + balls[i].dx;
		balls[i].nextY = balls[i].y + balls[i].dy;
	}

	//update to wall collisions
	for (var i = 0; i < balls.length; i++){
		balls[i].checkWallCollision();
	}

	//update to another ball collisions
	for (var i = 0; i < balls.length; i++){
		if (balls[i].spawn){
			if (checkSpawnCollision(balls[i])){
				// updateSpawnCollision(balls[i]);
				updateSpawnCollision(balls[i], spawner);
			}
		} else{
			if (!checkSpawnCollision(balls[i]))
				balls[i].spawn = true;
		}
		
		for (var j = i + 1; j < balls.length; j++){
			if (checkBallCollision(balls[i], balls[j])){
				updateCol(balls[i], balls[j]);
			}
		}
	}

	//prepare for the next draw
	context2D.fillStyle = '#000000';
	clear();
	board();

	//draw the ball
	for (var i = 0; i < balls.length; i++){
		balls[i].render();
	}

	requestAnimationFrame(animate);
}

function checkPlayerHit(x, y){
	for (var i = 0; i < balls.length; i++){
		if (Math.pow(x - balls[i].x, 2) + Math.pow(y - balls[i].y, 2)
			<= Math.pow(balls[i].radius, 2))
			active = false;
	}
}

//
// Start the game
//
function start(){
	screen = 1;
	score = 0;
	active = true;
	speed = 2;
	level = 0;
	size = 7;
	balls = [];
	game = true;
	over = false;
	spawnTimer = 3;

	clearIntervals();

	clear();
	board();

	intervals.push(setInterval(function(){
		spawnTimer--;
		if (spawnTimer < 0){
			spawnTimer = prodPause;
			addBall(speed, Math.floor(Math.random() * (5)) + size - 2);
		}
	}, 1000));

	requestAnimationFrame(animate);
}

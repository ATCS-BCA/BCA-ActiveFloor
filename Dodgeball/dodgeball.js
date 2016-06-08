var score = 0;
var active = true;
var speed = 2;
var level = 0;
var size = 10;
var productionrate = 1;
var game = false;
var balls = [];
var spawnRadius;
var over = false;
var startBtn, restartBtn;
var intervals = [];
var firstRun = true;
var contact = false;

//
// Start Menu
//
function menu(){
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
    
    if (game == true)
    	start();
    else
	    setTimeout(function() {menu();} ,1);
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
	context2D.arc(canvas.width/2, canvas.height/2, spawnRadius, 0, Math.PI * 2);
	context2D.stroke();

}

//
// Show gameOver screen
//
function gameOver(){
	for (var i = 0; i < intervals.length; i++)
		clearInterval(intervals[i]);

	context2D.fillStyle = 'red';
    context2D.font = '24px sans-serif';
    
    context2D.fillText('Game Over!', ((canvas.width / 2) - (context2D.measureText('Game Over!').width / 2)), 50);

    context2D.font = '12px sans-serif';
    context2D.fillText('Your Score Was: ' + score, 
    	((canvas.width / 2) - (context2D.measureText('Your Score Was: ' + score).width / 2)), 70);
    
    context2D.strokeStyle = '#3498db';
    context2D.fillText('Restart', restartBtn.x, restartBtn.y);
    context2D.strokeRect(restartBtn.bx, restartBtn.by, restartBtn.bw, restartBtn.bh);

    if (!over){
    	game = false;
	    setTimeout(menu, 1);
    }else
    	setTimeout(gameOver, 1)
}

//
// Make a ball object
//
function Ball(speed, size){
	this.dx = (Math.floor(Math.random() * (5)) + speed - 1)*3/8;
	this.dy = (Math.floor(Math.random() * (5)) + speed - 1)*3/8;
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
	this.duration = 8;
}

//
// Check the wall collision and update
//
Ball.prototype.checkWallCollision = function(){

	//move the ball
	if (this.nextX + this.radius > canvas.width){
		this.dx *= −1;
		this.nextX = canvas.width - this.radius;
	}else if (this.nextX - this.radius + this.dx < 0){
		this.dx *= -1;
		this.nextX = this.radius;
	}else if (this.nextY + this.radius > canvas.height){
		this.dy *= -1;
		this.nextY = canvas.height − this.radius;
	}else if (this.nextX - this.radius < 0){
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


Ball.prototype.render = function(){
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
	if (Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2)) <= b1.radius + b2.radius)
		return true;
	else
		return false;
}

//
// Check if ball collides with the spawner
//
function checkSpawnCollision(b){
	if (Math.sqrt(Math.pow(b.x - canvas.width/2, 2) + Math.pow(b.y - canvas.height/2, 2)) 
		<= b.radius + spawnRadius)
		return true;
	else
		return false;
}

//
// If it collides, change the ball direction and speed
//
function updateCol(b1, b2){
	var collisionAngle = Math.atan(b1.nextY - b2.nextY, b1.nextX - b2.nextX)
	b1.updateInfo();
	b2.updateInfo();

	// var dx1 = (b1.dx * (b1.radius - b2.radius) + b2.dx * 2 * b2.radius)
	// 		/(b1.radius + b2.radius);
	// var dx2 = (b2.dx * (b2.radius - b1.radius) + b1.dx * 2 * b1.radius)
	// 		/(b1.radius + b2.radius);

	// var dy1 = (b1.dy * (b1.radius - b2.radius) + b2.dy * 2 * b2.radius)
	// 		/(b1.radius + b2.radius);
	// var dy2 = (2 * b1.radius * b1.dy + (b2.radius - b1.radius) * b2.dy)
	// 		/(b1.radius + b2.radius);
	var dx1 = b1.speed * Math.cos(b1.direction - collisionAngle);
	var dx2 = b2.speed * Math.cos(b2.direction - collisionAngle);

	var dy1 = b1.speed * Math.sin(b1.direction - collisionAngle);
	var dy2 = b2.speed * Math.sin(b2.direction - collisionAngle);

	var final_dx1 = ((b1.mass - b2.mass) * dx1 + 2 * b2.mass * dx2)
		/(b1.mass + b2.mass);
	var final_dx2 = ((b2.mass - b1.mass) * dx2 + 2 * b1.mass * dx1)/(b1.mass + b2.mass);
	var final_dy1 = dy1;
	var final_dy2 = dy2;

	// b1.dx = dx1;
	// b2.dx = dx2;
	// b1.dy = dy1;
	// b2.dy = dy2;
	b1.dx = Math.cos(collisionAngle) * final_dx1 + 
		Math.cos(collisionAngle + Math.PI/2) * final_dy1;
	b2.dx = Math.cos(collisionAngle) * final_dx2 + 
		Math.cos(collisionAngle + Math.PI/2) * final_dy2;
	b1.dy = Math.sin(collisionAngle) * final_dx1 + 
		Math.sin(collisionAngle + Math.PI/2) * final_dy1;
	b2.dy = Math.sin(collisionAngle) * final_dx2 + 
		Math.sin(collisionAngle + Math.PI/2) * final_dy2;

	b1.nextX += b1.dx;
	b2.nextX += b2.dx;

	b1.nextY += b1.dy;
	b2.nextY += b2.dy;
}

//
// Check if the x and y value of player touches the ball
//
function checkPlayerHit(x, y){
	for (var i = 0; i < balls.length; i++){
		if (Math.pow(x - balls[i].x, 2) + Math.pow(y - balls[i].y, 2)
			<= Math.pow(balls[i].radius, 2))
			active = false;
	}
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
		contact = false;

		for (var j = i + 1; j < balls.length; j++){
			if (checkBallCollision(balls[i], balls[j])){
				updateCol(balls[i], balls[j]);
				contact = true;
			}
		}

		if (balls[i].spawn){
			if (checkSpawnCollision(balls[i])){
				balls[i].dx *= -1;
				balls[i].dy *= -1;
			}
		} else{
			if (!checkSpawnCollision(balls[i]) && !contact)
				balls[i].spawn = true;
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

function instructions(){

}

//
// Start the game
//
function start(){
	score = 0;
	active = true;
	speed = 2;
	level = 0;
	size = 10;
	productionrate = 1;
	balls = [];
	over = false;
	spawnRadius = size + 5;
	intervals = [];


	clear();
	addBall(speed, 10);
	board();
	intervals.push(setInterval(function(){ addBall(speed, size); }, 10000));
	requestAnimationFrame(animate);
}


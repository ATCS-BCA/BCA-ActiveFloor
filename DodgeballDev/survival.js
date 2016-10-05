var size;
var balls = [];
var spawner;

//
// Draw the survivalBoard (AKA the spawner)
//
function survivalBoard(){
	context2D.strokeStyle = spawner.strokeColor;
	context2D.beginPath();
	context2D.arc(spawner.x, spawner.y, spawner.radius, 0, Math.PI * 2);
	context2D.stroke();
	spawnTime();
	context2D.closePath();

	context2D.fillStyle = '#2ecc71';
	context2D.font = '10px Arial';
	context2D.fillText('Score: ' + score, 
		canvas.width - context2D.measureText('Score:' + score).width - 5, 10);
}

//
// Draw the time until new spawn
//
function spawnTime(){
	context2D.fillStyle = spawner.fillColor;
	context2D.fillText(spawner.timer, 
		spawner.x - context2D.measureText(spawner.timer).width / 2, spawner.y  + 3);
}

//
// Make a ball object
//
function Ball(speed, size){
	this.dx = getRandomIntInclusive(speed, speed + 10)*11/64;
	this.dy = getRandomIntInclusive(speed, speed + 10)*11/64;

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
}

//
// If collides with spawner, make it bounce off of it
//
function updateSpawnCollision(b1, b2){
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
// animate the balls in survival mode
//
function animate(){
	'use strict';
	if (!active){
		clear();
		game = -1;
		over = true;
		screen = 3;
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

	//update to another ball and spawner collisions
	for (var i = 0; i < balls.length; i++){
		// check the spawn
		if (balls[i].spawn){
			if (checkSpawnCollision(balls[i]))
				updateSpawnCollision(balls[i], spawner);
			
		} else{
			//only if didn't leave spawner after spawn to avoid getting stuck
			if (!checkSpawnCollision(balls[i]))
				balls[i].spawn = true;
		}
		
		//ball to ball Collision
		for (var j = i + 1; j < balls.length; j++){
			if (checkBallCollision(balls[i], balls[j])){
				updateCol(balls[i], balls[j]);
			}
		}
	}

	//prepare for the next draw
	context2D.fillStyle = '#000000';
	clear();
	survivalBoard();

	//draw the ball
	for (var i = 0; i < balls.length; i++){
		balls[i].render();
	}

	requestAnimationFrame(animate);
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
	spawner.timer = 3;
	spawner.maxTime = 5;

	clearIntervals();

	clear();
	survivalBoard();

	//after every spawner.maxTime seconds, spawn it and update the timer
	intervals.push(setInterval(function(){
		spawner.timer--;
		if (spawner.timer < 0){
			spawner.timer = spawner.maxTime;
			addBall(speed, Math.floor(Math.random() * (5)) + size - 2);
		}
	}, 1000));

	requestAnimationFrame(animate);
}

//
// Check if player coordinates are inside a ball
//
function checkPlayerHit(x, y){
	for (var i = 0; i < balls.length; i++){
		if (Math.pow(x - balls[i].x, 2) + Math.pow(y - balls[i].y, 2)
			<= Math.pow(balls[i].radius, 2)){
			active = false;
			game = -1;
		}
	}
}

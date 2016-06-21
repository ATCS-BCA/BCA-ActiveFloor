var thick = 2;
var lasers = [];

//
// Draw the board (AKA the place where lasers doesn't spawn)
//
function Laserboard(){
	context2D.strokeStyle = safeArea.strokeColor;
	context2D.fillRect(safeArea.x, safeArea.y, safeArea.w, safeArea.h);
}

//
// Make a laser object
//
function Laser(speed, thickness, slope, yint){
	this.speed = getRandomIntInclusive(speed - 2, speed + 4)*3/16;

	this.thickness = thickness;
	
	this.m = slope;
	this.b = yint;
	this.nextB = this.b;

	this.x1 = 0;
	this.y1 = b;
	
	this.x2 = canvas.width;
	this.y2 = this.x2 * m + b;

	this.nextX1 = 0;
	this.nextX2 = canvas.width();
	this.nextY1 = this.y1;
	this.nextY2 = this.y2;
	this.spawn = false;
}


//
// Draw the Laser
//
Laser.prototype.render = function(){
	this.x = this.nextX;
	this.y = this.nextY;
	this.b = this.nextB;

	context2D.beginPath();
	context2D.lineWidth = this.thickness;
	context2D.moveTo(this.x1,this.y1);
	context2D.lineTo(this.x2,this.y2);
	context2D.closePath();

	context2D.strokeStyle = '#e74c3c';
	context2D.stroke();

};

//
// update the coordinates
//
Laser.prototype.update = function(){
	this.nextY1 = this.nextB;
	this.nextY2 = canvas.width * this.m + this.nextB;
};

//
//
//
Laser.prototype.checkSpawnIntersection = function(){
	if ((this.nextX1 < safeArea.x && this.nextX2 < safeArea.x)
		|| (this.nextX1 > safeArea.x + safeArea.w && this.nextX2 > safeArea.x + safeArea.w))
		return true;
	else if ((this.nextY1 < safeArea.y && this.nextY2 < safeArea.y)
		|| (this.nextY1 > safeArea.y + safeArea.h && this.nextY2 > safeArea.y + safeArea.h))
		return true;
	else
		return false;
};

//
// add the laser to the array
//
function addLaser(speed, thickness, slope, yint){
	laser.push(new Laser(speed, thickness, slope, yint));
	score++;
}

//
// Check if Laser collides with the spawner
//
function checkSpawnCollision(b){
	if (Math.sqrt(Math.pow(b.nextX - spawner.x, 2) + Math.pow(b.nextY - spawner.y, 2)) 
		<= b.radius + spawner.radius)
		return true;
	else
		return false;
}

//
// animate the lasers in survival mode
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
	for (var i = 0; i < lasers.length; i++){
		lasers[i].nextB = lasers[i].b + lasers[i].speed;
		laserts[i].update();
	}

	//update to another Laser and spawner collisions
	for (var i = 0; i < lasers.length; i++){
		// check the spawn
		if (lasers[i].spawn){
			if (checkSpawnIntersection(lasers[i])){
				lasers[i].spawn = false;
				updateSpawnIntersection(lasers[i], spawner);
			}
			
		} else{
			//only if didn't leave spawner after spawn to avoid getting stuck
			if (!checkSpawnIntersection(lasers[i]))
				lasers[i].spawn = true;
		}
	}

	//prepare for the next draw
	context2D.fillStyle = '#000000';
	clear();
	survivalBoard();

	//draw the Laser
	for (var i = 0; i < lasers.length; i++){
		lasers[i].render();
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
	lasers = [];
	game = true;
	over = false;
	spawner.timer = 3;
	spawner.maxTime = 8;

	clearIntervals();

	clear();
	survivalBoard();

	//after every spawner.maxTime seconds, spawn it and update the timer
	intervals.push(setInterval(function(){
		spawner.timer--;
		if (spawner.timer < 0){
			spawner.timer = spawner.maxTime;
			addLaser(speed, Math.floor(Math.random() * (5)) + size - 2);
		}
	}, 1000));

	requestAnimationFrame(animate);
}

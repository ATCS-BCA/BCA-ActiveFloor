var thick = 2;
var lasers = [];

//
// Draw the board (AKA the place where lasers doesn't spawn)
//
function laserBoard(){
	context2D.strokeStyle = safeArea.strokeColor;
	context2D.lineWidth = safeArea.lineWidth;
	context2D.strokeRect(safeArea.x, safeArea.y, safeArea.w, safeArea.h);
	context2D.fillStyle = spawner.fillColor;
	context2D.fillText(spawner.timer, 
		spawner.x - context2D.measureText(spawner.timer).width / 2, spawner.y  + 5);
}

//
// Make a laser object
//
function Laser(speed, thickness){
	this.speed = getRandomIntInclusive(speed - 2, speed + 4)*3/16;

	this.thickness = thickness;
	this.mode;

	this.int = this.getRandomSpawn();
	
	var num = getRandomIntInclusive(0, 1);
	if (this.mode == 'v'){
		this.y1 = this.int;
		this.y2 = this.int;
		this.x1 = 0;
		this.x2 = canvas.width;
	} else if (this.mode == 'h'){
		this.x1 = this.int;
		this.x2 = this.int;
		this.y1 = 0;
		this.y2 = canvas.width;
	}
	// else
	// 	this.mode = 'r'
	this.nextInt = this.int;
	this.spawn = false;
}


//
// Draw the Laser
//
Laser.prototype.render = function(){
	if (this.mode == 'v'){
		this.y1 = this.nextInt;
		this.y2 = this.nextInt;
	} else if (this.mode == 'h'){
		this.x1 = this.nextInt;
		this.x2 = this.nextInt;
	}
	this.int = this.nextInt;
	
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
	this.nextInt += this.speed;
};

Laser.prototype.getRandomSpawn = function(){
	if (Math.floor(Math.random() * 2) == 0){
		if (Math.floor(Math.random() * 2) == 0){//left
			if (this.speed < 0)
				this.speed *= -1;
			return getRandomArbitrary(0, safeArea.x);
		} else{//right
			if (this.speed > 0)
				this.speed *= -1;
			return getRandomArbitrary(safeArea.x + safeArea.w, canvas.width);
		}
		this.mode = 'v';
	} else{
		if (Math.floor(Math.random() * 2) == 0){//up
			if (this.speed < 0)
				this.speed *= -1;
			return getRandomArbitrary(0, safeArea.y);
		} else{//down
			if (this.speed > 0)
				this.speed *= -1;
			return getRandomArbitrary(safeArea.y + safeArea.h, canvas.height);
		}
		this.mode = 'h';
	}

}

//
//
//
Laser.prototype.checkSpawnIntersection = function(){
	if ((this.x1 < safeArea.x && this.x2 < safeArea.x)
		|| (this.x1 > safeArea.x + safeArea.w && this.x2 > safeArea.x + safeArea.w))
		return true;
	else if ((this.y1 < safeArea.y && this.y2 < safeArea.y)
		|| (this.y1 > safeArea.y + safeArea.h && this.y2 > safeArea.y + safeArea.h))
		return true;
	else
		return false;
};

//
//
//
function updateSpawnIntersection(l){
	l.speed *= -1;
	l.spawn = false;
}

//
// add the laser to the array
//
function addLaser(speed, thickness){
	lasers.push(new Laser(speed, thickness));
	score++;
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
		lasers[i].update();
	}

	//update to another Laser and spawner collisions
	for (var i = 0; i < lasers.length; i++){
		// check the spawn
		if (lasers[i].spawn){
			if (lasers[i].checkSpawnIntersection()){
				updateSpawnIntersection(lasers[i]);
			}
			
		} else{
			//only if didn't leave spawner after spawn to avoid getting stuck
			if (!lasers[i].checkSpawnIntersection())
				lasers[i].spawn = true;
		}
	}

	//prepare for the next draw
	context2D.fillStyle = '#000000';
	clear();
	laserBoard();

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
	spawner.maxTime = 5;

	clearIntervals();

	clear();
	laserBoard();

	//after every spawner.maxTime seconds, spawn it and update the timer
	intervals.push(setInterval(function(){
		spawner.timer--;
		if (spawner.timer < 0){
			spawner.timer = spawner.maxTime;
			addLaser(speed, getRandomIntInclusive(1, 5));
		}
	}, 1000));

	requestAnimationFrame(animate);
}


//
// Check if player coordinates are inside a ball
//
function checkPlayerHit(x, y){
	for (var i = 0; i < lasers.length; i++){
		if ((lasers[i].mode == 'v' && y == lasers[i].int)
			|| (lasers[i].mode == 'h' && x == lasers[i].int)){
			active = false;
			game = -1;
		}
	}
}

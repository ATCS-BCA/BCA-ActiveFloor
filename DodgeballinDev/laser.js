var thick = 10;
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
function Laser(){
	this.thickness = 8;
	this.mode;
	this.speed = 1/this.thickness * 8;

	this.int = getRandomSpawn(this);
	
	if (this.mode == 'h'){
		this.y1 = this.int;
		this.y2 = this.int;
		this.x1 = 0;
		this.x2 = canvas.width;
	} else if (this.mode == 'v'){
		this.x1 = this.int;
		this.x2 = this.int;
		this.y1 = 0;
		this.y2 = canvas.height;
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
		this.x1 = this.nextInt;
		this.x2 = this.nextInt;
	} else if (this.mode == 'h'){
		this.y1 = this.nextInt;
		this.y2 = this.nextInt;
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

function getRandomSpawn(l){
	var dir = getRandomIntInclusive(1,2);
	
	if (dir == 1){//left || up
		if (l.speed < 0)
			l.speed *= -1;
	} else{//right || down
		if (l.speed > 0)
			l.speed *= -1;
	}

	if (getRandomIntInclusive(1,2) == 1){
		l.mode = 'v';
		if (dir == 1){//left
			return getRandomArbitrary(0, safeArea.x);
		} else{//right
			return getRandomArbitrary(safeArea.x + safeArea.w, canvas.width);
		}
	} else{
		l.mode = 'h';
		if (dir == 1){//up
			return getRandomArbitrary(0, safeArea.y);
		} else{//down
			return getRandomArbitrary(safeArea.y + safeArea.h, canvas.height);
		}
	}

}

//
//
//
Laser.prototype.checkWallIntersection = function(){
	if (this.mode == 'v'){
		if (this.int <= 0){
			if (!this.spawn)
				this.speed *= -1;
				this.thickness -= 2;
				this.speed = this.changeSpeed();
				this.nextInt = this.speed;
		} else if (this.int >= canvas.width){
			if (!this.spawn)
				this.speed *= -1;
				this.thickness -= 2;
				this.speed = this.changeSpeed();
				this.nextInt = canvas.width + this.speed;
				return true;
		}
		
	} else if (this.mode == 'h'){
		if (this.int <= 0){
			if (!this.spawn)
				this.speed *= -1;
				this.thickness -= 2;
				this.speed = this.changeSpeed();
				this.nextInt = this.speed;
				return true;
		}
		else if (this.int >= canvas.height){
			if (!this.spawn)
				this.speed *= -1;
				this.thickness -= 2;
				this.speed = this.changeSpeed();
				this.nextInt = canvas.height + this.speed;
				return true;
		}
	}
	return false;
};

//
//
//
Laser.prototype.changeSpeed = function(){
	return 1/this.thickness * 8;
}


//
// add the laser to the array
//
function addLaser(){
	lasers.push(new Laser());
	score++;
}



//
// animate the lasers in laser mode
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

	//update wall collisions
	for (var i = 0; i < lasers.length; i++){
		// check the wall
		if (lasers[i].spawn){
			if (lasers[i].checkWallIntersection())
			lasers[i].spawn = false;			
		} else{
			//only if didn't leave spawner after spawn to avoid getting stuck
			lasers[i].checkWallIntersection()
		}

		// if (lasers[i].checkInsideSpawn())
		// 	lasers[i].spawn = true;
		// else
		// 	lasers[i].spawn = false;
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
	spawner.maxTime = 3;

	clearIntervals();

	clear();
	laserBoard();

	//after every spawner.maxTime seconds, spawn it and update the timer
	intervals.push(setInterval(function(){
		spawner.timer--;
		if (spawner.timer < 0){
			spawner.timer = spawner.maxTime;
			addLaser();
		}
	}, 1000));

	requestAnimationFrame(animate);
}


//
// Check if player coordinates touches the laser
//
function checkPlayerHit(x, y){
	for (var i = 0; i < lasers.length; i++){
		if ((lasers[i].mode == 'h' && 
				(y >= lasers[i].int - lasers[i].thickness/2 && y <= lasers[i].int + lasers[i].thickness/2))
			|| (lasers[i].mode == 'v' && 
				(x >= lasers[i].int - lasers[i].thickness/2 && x <= lasers[i].int + lasers[i].thickness/2))){
			active = false;
			game = -1;
		}
	}
}

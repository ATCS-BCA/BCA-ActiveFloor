var thick = 10;
var lasers = [];
var num;

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

	context2D.fillStyle = '#2ecc71';
	context2D.font = '10px Arial';
	context2D.fillText('Score: ' + score, 
		canvas.width - context2D.measureText('Score:' + score).width - 5, 10);
}

//
// Make a laser object
//
function Laser(){
	this.id = num++;
	this.thickness = 10;
	this.mode;
	this.speed = 1/this.thickness * 10;

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

	this.nextInt = this.int;
	this.spawn = false;
	this.draw = true;
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
				this.thickness -= 2;
				this.speed = this.changeSpeed();
				this.nextInt = this.speed;
				return true;

		} else if (this.int >= canvas.width){
			if (!this.spawn)
				this.thickness -= 2;
				this.speed = this.changeSpeed();
				this.speed *= -1;
				this.nextInt = canvas.width + this.speed;
				return true;
		}
		
	} else if (this.mode == 'h'){
		if (this.int <= 0){
			if (!this.spawn)
				this.thickness -= 2;
				this.speed = this.changeSpeed();
				this.nextInt = this.speed;
				return true;
		}
		else if (this.int >= canvas.height){
			if (!this.spawn)
				this.thickness -= 2;
				this.speed = this.changeSpeed();
				this.speed *= -1;
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
	return 1/this.thickness * 10;
};

//
// check if left out of spawn
//
Laser.prototype.insideSafe = function(){
	if (this.mode == 'v'){
		if (this.int >= safeArea.x && this.int <= safeArea.x + safeArea.w)
			return true;
	}else if (this.mode = 'h'){
		if (this.int >= safeArea.y && this.int <= safeArea.y + safeArea.h)
			return true;
	}
	return false;
};

//
//update score
//
function updateScore(l){
	var multiplier = ((thick - l.thickness)/2 + 1);
	score += multiplier;
}
//
// add the laser to the array
//
function addLaser(){
	lasers.push(new Laser());
	score++;
}

//
// Remove laser from array
//
function removeLaser(i){
	lasers.splice(i, 1);
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
			if (lasers[i].insideSafe())
				lasers[i].spawn = false;			
		} else{
			//only if didn't leave spawner after spawn to avoid getting stuck
			if (lasers[i].checkWallIntersection())
				updateScore(lasers[i]);
		}
	}

	//check if laser should be removed
	for (var i = 0; i < lasers.length; i++){
		if (lasers[i].thickness <= (thick - 8))
			removeLaser(i);
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
	num = 0;
	checkPlayerContact();

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
		if ((lasers[i].mode == 'h' && Math.abs(y - lasers[i].int) <= lasers[i].thickness/2)
			|| (lasers[i].mode == 'v' && Math.abs(x - lasers[i].int) <= lasers[i].thickness/2)){
			active = false;
			game = -1;
		}
	}
}

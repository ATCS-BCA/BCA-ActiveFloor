var score = 0;
var active = true;
var speed = 2;
var level = 0;
var size = 1;
var productionrate = 1;
var game = false;
var balls = [];
var startX, startY, startW, startH;

function Ball(speed, size){
	this.dx = (Math.floor(Math.random() * (5)) + speed - 1)/4;
	this.dy = (Math.floor(Math.random() * (5)) + speed - 1)/4;
	this.radius = size;
	this.x = Math.floor(Math.random() * 
		((canvas.width - this.radius) - this.radius + 1)) + this.radius;
	this.y = Math.floor(Math.random() * 
		((canvas.height - this.radius) - this.radius + 1)) + this.radius;
	this.v = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy,2));
	this.duration = 8;
}

Ball.prototype.update = function(){

	//move the ball
	if ((this.x + this.dx + this.radius > canvas.width)
		|| (this.x - this.radius + this.dx < 0)){
		
		this.dx *= -1;
	}
	if ((this.y + this.dy + this.radius > canvas.height)
		|| (this.y - this.radius + this.dy < 0)){
		
		this.dy *= -1;
	}

	this.x += this.dx;
	this.y += this.dy;
	this.duration--;
	if (this.duration <= 0){
	}
};

Ball.prototype.draw = function(){
	context2D.beginPath();
	context2D.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);

	context2D.fillStyle = '#e74c3c';
	context2D.fill();

};

function addBall(speed, size){
	balls.push(new Ball(speed, size));
}

function checkCollision(b1, b2){
	if (Math.sqrt(Math.pow(b1.x - b2.x, 2) + Math.pow(b1.y - b2.y, 2)) <= b1.radius + b2.radius)
		return true;
	else
		return false;
}

function updateCol(b1, b2){
	b1.v = (b1.v * (b1.radius - b2.radius) + b2.v * 2 * b2.radius)
			/(b1.radius + b2.radius);
	b2.v = (2 * b1.radius * b1.v + (b2.radius - b1.radius) * b2.v)
			/(b1.radius + b2.radius);
}

function hit(x, y){
	for (var i = 0; i < balls.length; i++){
		if (Math.pow(x - balls[i].x, 2) + Math.pow(y - balls[i].y, 2)
			<= Math.pow(balls[i].radius, 2))
			active = false;
	}
}

function updateBalls(){
	'use strict';
	if (active == false){
		gameOver();
		return;
	}

	for (var i = 0; i < balls.length; i++){
		balls[i].update();
	}

	for (var i = 0; i < balls.length; i++){
		for (var j = i + 1; j < balls.length; j++){
			if (checkCollision(balls[i], balls[j])){
				updateCol(balls[i], balls[j]);
			}
		}
	}

	context2D.fillStyle = '#000000';
	context2D.clearRect(0, 0, canvas.width, canvas.height);

	for (var i = 0; i < balls.length; i++){
		balls[i].draw();
	}

	requestAnimationFrame(updateBalls);
}

function start(){
	context2D.clearRect(0, 0, canvas.width, canvas.height);
	addBall(speed, 10);
	setInterval(function(){ addBall(speed, 10); }, 10000);
	requestAnimationFrame(updateBalls);
}

function menu(){
	active = true;
	context2D.clearRect(0, 0, canvas.width, canvas.height);

	context2D.fillStyle = 'green';
    context2D.font = '24px sans-serif';
    
    context2D.fillText('DODGEBALL', ((canvas.width / 2) - 
    	(context2D.measureText('DODGEBALL').width / 2)), 50);

    context2D.font = '12px sans-serif';
    context2D.strokeStyle = 'blue';
    context2D.fillText('Start', 
    	((canvas.width / 2) - (context2D.measureText('Start').width / 2)), 70);
    context2D.strokeText('Start', 
    	((canvas.width / 2) - (context2D.measureText('Start').width / 2)), 70);
    startX = (canvas.width / 2) - (context2D.measureText('Start').width / 2);
    startY = 70;
    startW = context2D.measureText('Start').width;
    startH = context2D.measureText('Start').height;

    if (game == true){
    	start();
    }

    setTimeout(menu,1000);
}

function gameOver(){
	score = 0;
	active = true;
	speed = 2;
	level = 0;
	size = 1;
	productionrate = 1;
	balls = [];
	context2D.clearRect(0, 0, canvas.width, canvas.height);

	context2D.fillStyle = 'red';
    context2D.font = '6px sans-serif';
    
    context2D.fillText('Game Over!', ((canvas.width / 2) - (context2D.measureText('Game Over!').width / 2)), 50);

    context2D.font = '6px sans-serif';
    context2D.fillText('Your Score Was: ' + score, 
    	((canvas.width / 2) - (context2D.measureText('Your Score Was: ' + score).width / 2)), 70);
    setTimeout(gameOver,1000);
}
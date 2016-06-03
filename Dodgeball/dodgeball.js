var score = 0;
var active = true;
var speed = 2;
var level = 0;
var size = 10;
var productionrate = 1;
var game = false;
var balls = [];
var counter =0;
var startBtn, restartBtn;


function Ball(speed, size){
	this.dx = (Math.floor(Math.random() * (5)) + speed - 1)/4;
	this.dy = (Math.floor(Math.random() * (5)) + speed - 1)/4;
	this.radius = size;
	this.x = canvas.width/2;
	this.y = canvas.height/2;
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
	dx1 = (b1.dx * (b1.radius - b2.radius) + b2.dx * 2 * b2.radius)
			/(b1.radius + b2.radius);
	dx2 = (b2.dx * (b2.radius - b1.radius) + b1.dx * 2 * b1.radius)
			/(b1.radius + b2.radius);

	dy1 = (b1.dy * (b1.radius - b2.radius) + b2.dy * 2 * b2.radius)
			/(b1.radius + b2.radius);
	dy2 = (2 * b1.radius * b1.dy + (b2.radius - b1.radius) * b2.dy)
			/(b1.radius + b2.radius);

	b1.dx = dx1;
	b2.dx = dx2;
	b1.dy = dy1;
	b2.dy = dy2;
}

function hit(x, y){
	for (var i = 0; i < balls.length; i++){
		if (Math.pow(x - balls[i].x, 2) + Math.pow(y - balls[i].y, 2)
			<= Math.pow(balls[i].radius, 2))
			active = false;
	}
}

function animate(){
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
	clear();
	board();
	for (var i = 0; i < balls.length; i++){
		balls[i].draw();
	}

	requestAnimationFrame(animate);
}

function start(){
	clear();
	addBall(speed, 10);
	board();
	setInterval(function(){ addBall(speed, size); }, 5000);
	requestAnimationFrame(animate);
}

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

function clear(){
	context2D.clearRect(0,0,canvas.width, canvas.height);
}

function board(){
	context2D.strokeStyle = 'blue';
	context2D.beginPath();
	context2D.arc(canvas.width/2, canvas.height/2, size, 0, Math.PI * 2);
	context2D.stroke();

}

function gameOver(){
	score = 0;
	active = true;
	speed = 2;
	level = 0;
	size = 10;
	productionrate = 1;
	balls = [];
	clear();

	context2D.fillStyle = 'red';
    context2D.font = '24px sans-serif';
    
    context2D.fillText('Game Over!', ((canvas.width / 2) - (context2D.measureText('Game Over!').width / 2)), 50);

    context2D.font = '12px sans-serif';
    context2D.fillText('Your Score Was: ' + score, 
    	((canvas.width / 2) - (context2D.measureText('Your Score Was: ' + score).width / 2)), 70);
    
    // context2D.strokeStyle = 'blue';
    // context2D.fillText('Restart', restartBtn.x, restartBtn.y);
    // context2D.strokeRect(restartBtn.bx, restartBtn.by, restartBtn.bw, restartBtn.bh);

    counter++;
    if (counter >= 5000){
    	game = false;
    	counter = 0;
	    setTimeout(menu, 1);
    }else
    	setTimeout(gameOver, 1)
}
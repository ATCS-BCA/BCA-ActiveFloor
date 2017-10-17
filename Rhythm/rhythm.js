var balls = [];
var score;
var lose;
var timer = 5;

function Ball() {
    //x, y, radius, countdown
    this.radius = 14;
    this.x = Math.floor(Math.random()*canvas.width);
    this.y = Math.floor(Math.random()*canvas.height);
}

Ball.prototype.drawCircle = function() {
    context2D.fillStyle = "#FF0000";
    context2D.beginPath();
    context2D.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context2D.closePath();
    context2D.fill();
}

function addCircle() {
    balls.push(new Ball());
}

function draw() {
    for(var i = 0; i < balls.length; i++) {
        balls[i].drawCircle();
    }

    requestAnimationFrame(draw);
}

function start() {
    var balls = [];
    score = 0;
    lose = false;

    setInterval(function(){
        timer--;
        if(timer < 0) {
            addCircle();
            timer = 5;
        }
        //also need to check if individual countdowns are done
    }, 1000)

    requestAnimationFrame(draw);
}

$(document).ready(function () {
    'use strict';
    start();
});

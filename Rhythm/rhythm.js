var balls = [];
var score;
var lose;
var timer = 3;
var canvas, context2D;

function createCanvas() {
    canvas = document.getElementById('floorCanvas');
    canvas.width = 192;
    canvas.height = 192;
    context2D = canvas.getContext('2d');
}

function Ball() {
    //x, y, radius, countdown
    this.radius = 14;
    this.x = Math.floor(Math.random()*canvas.width);
    this.y = Math.floor(Math.random()*canvas.height);
}

Ball.prototype.drawCircle = function() {
    context2D.fillColor = "#FF0000";
    context2D.beginPath();
    context2D.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
    context2D.closePath();
    context2D.fill();
}

function addCircle() {
    balls.push(new Ball());
    requestAnimationFrame(draw);
}

function draw() {
    for(var i = 0; i < balls.length; i++) {
        balls[i].drawCircle();
    }
}

function start() {
    var balls = [];
    score = 0;
    lose = false;

    createCanvas();

    setInterval(function(){
        timer--;
        if(timer < 0) {
            addCircle();
            timer = 3;
        }
        //also need to check if individual countdowns are done
    }, 1000)

    requestAnimationFrame(draw);
}

$(document).ready(function () {
    'use strict';
    start();
});

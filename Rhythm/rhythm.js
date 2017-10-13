var balls = [];
var score;
var lose;
var timer;

function Ball(){
    //x, y, radius, countdown
    this.radius = 14;
    this.countdown = 3; //change eventually
    
}

Ball.prototype.checkCountdown = function() {
    //keep track of countdown - check if countdown < 0 or need to change #? 
    
}

Ball.prototype.drawCircle = function() {
    context2D.beginPath();
    context2D.drawArc(this.x, this.y, this.radius, 0, 2 * Math.PI);
}

Ball.prototype.addCircle = function() {

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
    }, 1000)
}


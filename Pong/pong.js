var animate=window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    function(callback){ window.setTimeout(callback, 1000/60) };

var canvas=document.createElement('canvas');
var width=192;
var height=192;
canvas.width=width;
canvas.height=height;
var context=canvas.getContext('2d');
context.font='12px sans-serif';



img=new Array(2);

imgcanvas=new Array(2);
imgctx=new Array(2);
imgdata=new Array(2);

for (var i=0;i<2;i++){
    img[i]=document.createElement('img')
    img[i].src='arrow'+(i+1)+'.png';
}



window.onload=function(){
    document.body.appendChild(canvas);
    animate(step);
};

var step=function(){
    update();
    render();
    animate(step);
};

var update=function(){
    player1.update();
    player2.update();
    ball.update(player1.paddle, player2.paddle);
};

var player1=new Player1();
var player2=new Player2();
var ball=new Ball(96, 96);

var render=function(){
    context.fillStyle="black";
    context.fillRect(0, 0, width, height);
    player1.render();
    player2.render();
    ball.render();
    context.fillStyle='green';
    context.fillText(player1.score, 4, 188);
    context.fillText(player2.score, 4, 14);
    context.fillStyle="black";
    context.strokeStyle='white';
    context.lineWidth=2;
    
    context.beginPath();
    context.moveTo(0,96);
    context.lineTo(64,96);
    context.moveTo(128,96);
    context.lineTo(192,96);
    context.stroke();
    
    context.lineWidth=1;
    context.beginPath();
    context.moveTo(64,64);
    context.lineTo(64,128);
    context.lineTo(128,128);
    context.lineTo(128,64);
    context.lineTo(64,64);
    context.stroke();

    context.fillStyle="white";
    for (var i=0;i<192;i+=2){
        if (i*2<64 || i*2>128)
        context.fillRect(96,i*2,1,1);
    }
    context.fillStyle="black";
    
    
    context.fillStyle='red';
    context.fillText('Restart', ((canvas.width / 2)-(context.measureText('Restart').width / 2)), 101);


    context.drawImage(img[0], 128, 128);
    context.drawImage(img[1], 32, 128);

    context.drawImage(img[0], 128, 32);
    context.drawImage(img[1], 32, 32);

    context.strokeStyle='red';
    context.beginPath();
    context.moveTo(128,128);
    context.lineTo(128+32,128);
    context.lineTo(128+32,128+32);
    context.lineTo(128,128+32);
    context.lineTo(128,128);

    context.moveTo(32,128);
    context.lineTo(32+32,128);
    context.lineTo(32+32,128+32);
    context.lineTo(32,128+32);
    context.lineTo(32,128);


    context.moveTo(128,32);
    context.lineTo(128+32,32);
    context.lineTo(128+32,32+32);
    context.lineTo(128,32+32);
    context.lineTo(128,32);

    context.moveTo(32,32);
    context.lineTo(32+32,32);
    context.lineTo(32+32,32+32);
    context.lineTo(32,32+32);
    context.lineTo(32,32);
    context.stroke();
};

function Paddle(x, y, width, height){
    this.x=x;
    this.y=y;
    this.width=width;
    this.height=height;
    this.x_speed=0;
    this.y_speed=0;
}

Paddle.prototype.render=function(){
    context.fillStyle="#FF0000";
    context.fillRect(this.x, this.y, this.width, this.height);
};

Paddle.prototype.move=function(x, y){
    this.x += x;
    this.y += y;
    this.x_speed=x;
    this.y_speed=y;
    if(this.x < 0){ // all the way to the left
        this.x=0;
        this.x_speed=0;
    } else if (this.x+this.width > 192){ // all the way to the right
        this.x=192-this.width;
        this.x_speed=0;
    }
}

function Player1(){
     this.paddle=new Paddle(80, 184, 33, 4);
     this.score=0;
}

Player1.prototype.update=function(){
    for(var key in keysDown){
        var value=Number(key);
        if(value == 37){ // left arrow
            this.paddle.move(-2, 0);
        } else if (value == 39){ // right arrow
                this.paddle.move(2, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

function press(a,b){
    if (a==0){
        player1.paddle.move(-2,0);
    }else if(a==1){
        player1.paddle.move(2, 0);
    }else{
        player1.paddle.move(0, 0);
    }


    if (b==0){
        player2.paddle.move(-2,0);
    }else if(b==1){
        player2.paddle.move(2, 0);
    }else{
        player2.paddle.move(0, 0);
    }
}

function Player2(){
    this.paddle=new Paddle(80, 4, 33, 4);
    this.score=0;
}

Player2.prototype.update=function(){
    for(var key in keysDown){
        var value=Number(key);
        if(value == 65){ // a
            this.paddle.move(-2, 0);
        } else if (value == 68){ // d
            this.paddle.move(2, 0);
        } else {
            this.paddle.move(0, 0);
        }
    }
};

Player1.prototype.render=function(){
    this.paddle.render();
};

Player2.prototype.render=function(){
    this.paddle.render();
};

function Ball(x, y){
    this.x=x;
    this.y=y;
    this.x_speed=0;
    this.y_speed=1;
    this.radius=4;
}

Ball.prototype.render=function(){
    context.beginPath();
    context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
    context.fillStyle="white";
    context.fill();
};

Ball.prototype.update=function(paddle1, paddle2){
    this.x += this.x_speed;
    this.y += this.y_speed;
    var top_x=this.x-4;
    var top_y=this.y-4;
    var bottom_x=this.x+4;
    var bottom_y=this.y+4;

    if(this.x-4 < 0){ // hitting the left wall
        this.x=4;
        this.x_speed=-this.x_speed;
    } else if(this.x+4 > 192){ // hitting the right wall
        this.x=188;
        this.x_speed=-this.x_speed;
    }

    if(this.y < 0){ // a point was scored
        player1.score++;
        this.x_speed=0;
        this.y_speed=1;
        this.x=96;
        this.y=96;
        player1.paddle.x = 80;
        player1.paddle.y = 184;
        player2.paddle.x = 80;
        player2.paddle.y = 4;
    }
    if(this.y > 192){ // a point was scored
        player2.score++;
        this.x_speed=0;
        this.y_speed=-1;
        this.x=96;
        this.y=96;
        player1.paddle.x = 80;
        player1.paddle.y = 184;
        player2.paddle.x = 80;
        player2.paddle.y = 4;
    }

    if(top_y > 96){
        if(top_y < (paddle1.y+paddle1.height) && bottom_y > paddle1.y && top_x < (paddle1.x+paddle1.width) && bottom_x > paddle1.x){
            // hit player1's paddle
            this.y_speed=-1;
            this.x_speed += (paddle1.x_speed / 2);
            this.y += this.y_speed;
        }
    } else {
        if(top_y < (paddle2.y+paddle2.height) && bottom_y > paddle2.y && top_x < (paddle2.x+paddle2.width) && bottom_x > paddle2.x){
            // hit player2's paddle
            this.y_speed=1;
            this.x_speed += (paddle2.x_speed / 2);
            this.y += this.y_speed;
        }
    }
};

var keysDown={};

window.addEventListener("keydown", function(event){
    keysDown[event.keyCode]=true;
});

window.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];
});
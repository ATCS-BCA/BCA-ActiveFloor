var canvas=document.createElement('canvas');
var width=192;
var height=192;
canvas.width=width;
canvas.height=height;
var context=canvas.getContext('2d');
context.font='12px sans-serif';

window.onload=function(){
    document.body.appendChild(canvas);
};

var step=function(){
    update();
    render();
};

var update=function(){

};

var render=function(){

}

function Ball(x, y){
    //x, y, radius
}

var keysDown={};

window.addEventListener("keydown", function(event){
    keysDown[event.keyCode]=true;
});

window.addEventListener("keyup", function(event){
    delete keysDown[event.keyCode];
});
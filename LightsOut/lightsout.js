canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
active = true;
player=0;
win=false;

window.onload = function()
{

    // Initialize the matrix.
    map = new Array(5);
    for (var i = 0; i < map.length; i++) {
        map[i] = [0,0,0,0,0];
    }

    for (var i=0;i<20;i++){
        rand = Math.floor(Math.random()*25);
        x=rand%5;
        y=Math.floor(rand/5);
        map[x][y] = 1-map[x][y];
        if (x>0) map[x-1][y] = 1-map[x-1][y];
        if (y>0) map[x][y-1] = 1-map[x][y-1];
        if (x<4) map[x+1][y] = 1-map[x+1][y];
        if (y<4) map[x][y+1] = 1-map[x][y+1];
    }





    canvas.width=192;
    canvas.height=192;

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);

    drawGame();

    function drawGame() 
    {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        for (var i=2;i<23;i++){
            if ((i-2)%4==0){
                ctx.moveTo(8*i,192-16);
                ctx.lineTo(8*i,16);
            }
        }
        for (var i=2;i<23;i++){
            if ((i-2)%4==0){
                ctx.moveTo(192-16,8*i);
                ctx.lineTo(16,8*i);
            }
        }
        ctx.stroke();

        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        
        ctx.moveTo(0,0);
        ctx.lineTo(0,192);
        ctx.lineTo(192,192);
        ctx.lineTo(192,0);
        ctx.lineTo(0,0);

        ctx.stroke();

        drawMain();




        if (win){
            setTimeout(showGameOver,2000);
            ctx.fillStyle = 'green';
            ctx.font = '16px sans-serif';
            
            ctx.fillText('You Win!', ((canvas.width / 2) - (ctx.measureText('You Win!').width / 2)), 101);

        }
        if (!win) setTimeout(drawGame,1000/60);
    }
}

function drawMain() {
    allEmpty=true;
    for (var i=0;i<map.length;i++){
        for (var j=0;j<map[i].length;j++){
            ctx.beginPath();
            if (map[i][j]==0){
                ctx.fillStyle = 'black';
            }else{
                allEmpty=false;
                ctx.fillStyle = 'blue';
            }
            ctx.rect(16+i*32+1,16+j*32+1,30,30);
            ctx.fill();


        }
    }

    if (allEmpty) win=true;
}

function press(a,b){
    map[a][b] = 1-map[a][b];
    if (a>0) map[a-1][b] = 1-map[a-1][b];
    if (b>0) map[a][b-1] = 1-map[a][b-1];
    if (a<4) map[a+1][b] = 1-map[a+1][b];
    if (b<4) map[a][b+1] = 1-map[a][b+1];
}

function showGameOver()
{

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.lineWidth = 2;
    active = false;
    
    ctx.fillStyle = 'red';
    ctx.font = '16px sans-serif';
    
    ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);

    ctx.font = '12px sans-serif';


    ctx.fillRect((canvas.width - ctx.measureText('Stand here to restart').width)/2-1, 86, ctx.measureText('Stand here to restart').width+3, 10+3);
    
    ctx.fillStyle = 'black';
    ctx.fillText('Stand here to restart', (canvas.width - ctx.measureText('Stand here to restart').width)/2, 192/2);
    

    if (win) setTimeout(showGameOver,1000/60);
}
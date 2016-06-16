canvas = document.createElement('canvas');
ctx = canvas.getContext('2d');
active = true;
player=0;
win=false;
first=true;

window.onload = function()
{

    // Initialize the matrix.
    map = new Array(3);
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(3);
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
        ctx.moveTo(64,0);
        ctx.lineTo(64,192);
        ctx.moveTo(128,0);
        ctx.lineTo(128,192);
        ctx.moveTo(0,64);
        ctx.lineTo(192,64);
        ctx.moveTo(0,128);
        ctx.lineTo(192,128);
        ctx.stroke();

        drawMain();


        ctx.lineWidth = 4;
        ctx.strokeStyle = 'white';
        ctx.beginPath();
        
        for (var i=0;i<3 && !win;i++){
            if (!win && map[i][0]!=-1 && map[i][0]==map[i][1] && map[i][1]==map[i][2]){
                ctx.moveTo(i*64+32,16);
                ctx.lineTo(i*64+32,176);
                win=true;
            }
            if (!win && map[0][i]!=-1 && map[0][i]==map[1][i] && map[1][i]==map[2][i]){
                ctx.moveTo(16,i*64+32);
                ctx.lineTo(176,i*64+32);
                win=true;
            }
        }
        if (!win && map[0][0]!=-1 && map[0][0]==map[1][1] && map[1][1]==map[2][2]){
            ctx.moveTo(16,16);
            ctx.lineTo(176,176);
            win=true;
        }
        if (!win && map[0][2]!=-1 && map[0][2]==map[1][1] && map[1][1]==map[2][0]){
            ctx.moveTo(176,16);
            ctx.lineTo(16,176);
            win=true;
        }
        
        ctx.stroke();


        if (first){
            setTimeout(function(){ first=false; }, 3000);
        }

        if (win) setTimeout(showGameOver,1000);
        if (!win) setTimeout(drawGame,1000/60);
    }
}

function drawMain() {
    for (var i=0;i<3;i++){
        for (var j=0;j<3;j++){
            if (map[i][j]==0){
                ctx.beginPath();
                ctx.moveTo(64*i+8,64*j+8);
                ctx.lineTo(64*i+56,64*j+56);
                ctx.moveTo(64*i+56,64*j+8);
                ctx.lineTo(64*i+8,64*j+56);
                ctx.stroke();
            }else if (map[i][j]==1){
                ctx.beginPath();
                ctx.arc(64*i+32,64*j+32, 24, 0, 2 * Math.PI);
                ctx.stroke();
            }else{
                map[i][j]=-1;
            }
        }
    }
}

function press(a,b){
    if (!first && map[b][a]==-1){
        map[b][a]=player;
        player=1-player;
    }
}

function showGameOver()
{

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

String.prototype.replaceAll = function(str1, str2, ignore) 
{
    return this.replace(new RegExp(str1.replace(/([\/\,\!\\\^\$\{\}\[\]\(\)\.\*\+\?\|\<\>\-\&])/g,"\\$&"),(ignore?"gi":"g")),(typeof(str2)=="string")?str2.replace(/\$/g,"$$$$"):str2);
} 
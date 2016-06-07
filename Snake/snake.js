function press(num){
    if (num === 38 && direction !== 3) {
        direction = 2; // Up
    } else if (num === 40 && direction !== 2) {
        direction = 3; // Down
    } else if (num === 37 && direction !== 0) {
        direction = 1; // Left
    } else if (num === 39 && direction !== 1) {
        direction = 0; // Right
    }
}


canvas = document.createElement('canvas'),
ctx = canvas.getContext('2d'),
score = 0,
level = 0,
direction = 0,
snake = new Array(3),
active = true,
speed = 400;




img=new Array(4);

imgcanvas=new Array(4);
imgctx=new Array(4);
imgdata=new Array(4);

for (var i=0;i<4;i++){
    img[i] = document.createElement('img')
    img[i].src='arrow'+(i+1)+'.png';
}

window.onload = function()
{

    // Initialize the matrix.
    var map = new Array(24);
    for (var i = 0; i < map.length; i++) {
        map[i] = new Array(24);
    }

    canvas.width=192;
    canvas.height=192;

    var body = document.getElementsByTagName('body')[0];
    body.appendChild(canvas);

    // Add the snake
    map = generateSnake(map);

    // Add the food
    map = generateFood(map);

    drawGame();

    window.addEventListener('keydown', function(e) {
        if (e.keyCode === 38 && direction !== 3) {
            direction = 2; // Up
        } else if (e.keyCode === 40 && direction !== 2) {
            direction = 3; // Down
        } else if (e.keyCode === 37 && direction !== 0) {
            direction = 1; // Left
        } else if (e.keyCode === 39 && direction !== 1) {
            direction = 0; // Right
        }
    });

    

    function drawGame() 
    {
        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = 'red';
        ctx.lineWidth = 2;
        
        ctx.beginPath();
        ctx.moveTo(0,0);
        ctx.lineTo(64,64);
        ctx.lineTo(64,128);
        ctx.lineTo(0,192);
        ctx.moveTo(64,64);
        ctx.lineTo(128,64);
        ctx.lineTo(192,0);
        ctx.moveTo(64,128);
        ctx.lineTo(128,128);
        ctx.lineTo(192,192);
        ctx.moveTo(128,64);
        ctx.lineTo(128,128);
        ctx.stroke();




        ctx.drawImage(img[0], 128+16, 64+16);
        ctx.drawImage(img[1], 0+16, 64+16);
        ctx.drawImage(img[2], 64+16, 128+16);
        ctx.drawImage(img[3], 64+16, 0+16);
        

        // Traverse all the body pieces of the snake, starting from the last one
        for (var i = snake.length - 1; i >= 0; i--) {

            // We're only going to perform the collision detection using the head
            // so it will be handled differently than the rest
            if (i === 0) {
                switch(direction) {
                    case 0: // Right
                        snake[0] = { x: snake[0].x + 1, y: snake[0].y }
                        break;
                    case 1: // Left
                        snake[0] = { x: snake[0].x - 1, y: snake[0].y }
                        break;
                    case 2: // Up
                        snake[0] = { x: snake[0].x, y: snake[0].y - 1 }
                        break;
                    case 3: // Down
                        snake[0] = { x: snake[0].x, y: snake[0].y + 1 }
                        break;
                }

                // Check that it's not out of bounds. If it is show the game over popup
                // and exit the function.
                if (snake[0].x < 0 || 
                    snake[0].x >= 24 ||
                    snake[0].y < 0 ||
                    snake[0].y >= 24) {
                    showGameOver();
                    return;
                }

                // Detect if we hit food and increase the score if we do,
                // generating a new food position in the process, and also
                // adding a new element to the snake array.
                
                //console.log(snake[0]);
                if (map[snake[0].x][snake[0].y] === 1) {
                    score += 10;
                    map = generateFood(map);

                    // Add a new body piece to the array 
                    snake.push({ x: snake[snake.length - 1].x, y: snake[snake.length - 1].y });
                    map[snake[snake.length - 1].x][snake[snake.length - 1].y] = 2;

                    // If the score is a multiplier of 100 (such as 100, 200, 300, etc.)
                    // increase the level, which will make it go faster.
                    if ((score % 100) == 0) {
                        level += 1;
                    }
                
                // Let's also check that the head is not hitting other part of its body
                // if it does, we also need to end the game.
                } else if (map[snake[0].x][snake[0].y] === 2) {
                    showGameOver();
                    return;
                }

                map[snake[0].x][snake[0].y] = 2;
            } else {
                // Remember that when they move, the body pieces move to the place
                // where the previous piece used to be. If it's the last piece, it
                // also needs to clear the last position from the matrix
                if (i === (snake.length - 1)) {
                    map[snake[i].x][snake[i].y] = null;
                }

                snake[i] = { x: snake[i - 1].x, y: snake[i - 1].y };
                map[snake[i].x][snake[i].y] = 2;
            }
        }

        // Draw the border as well as the score
        drawScore();

        // Start cycling the matrix
        for (var x = 0; x < map.length; x++) {
            for (var y = 0; y < map[0].length; y++) {
                if (x==1 && y==1);
                if (map[x][y] === 1) {
                    ctx.fillStyle = 'red';
                    ctx.fillRect(x * 8, y * 8, 8, 8);
                } else if (map[x][y] === 2) {
                    ctx.fillStyle = 'orange';
                    ctx.fillRect(x * 8, y * 8, 8, 8);          
                }
            }
        }
        
        if (active) {
            setTimeout(drawGame, speed - (level * 50));
        }
    }


    function drawScore(){
        ctx.lineWidth = 2;
        ctx.strokeStyle = 'red';
        ctx.strokeRect(1, 1, canvas.width-2, canvas.height-2);

        ctx.fillStyle = 'red';
        ctx.font = '12px sans-serif';
        ctx.fillText('Score: ' + score, ((canvas.width / 2) - (ctx.measureText('Score: ' + score).width / 2)), 90);
        ctx.fillText('Level: ' + level, ((canvas.width / 2) - (ctx.measureText('Level: ' + level).width / 2)), 110);
            
    }

    function generateFood(map)
    {
        // Generate a random position for the rows and the columns.
        var rndX = Math.round(Math.random() * 23),
            rndY = Math.round(Math.random() * 23);
        
        // We also need to watch so as to not place the food
        // on the a same matrix position occupied by a part of the
        // snake's body.
        while (map[rndX][rndY] === 2) {
            rndX = Math.round(Math.random() * 23);
            rndY = Math.round(Math.random() * 23);
        }
        
        map[rndX][rndY] = 1;

        return map;
    }

    function generateSnake(map)
    {
        // Generate a random position for the row and the column of the head.
        var rndX = Math.round(Math.random()*15+4),
            rndY = Math.round(Math.random()*15+4);

        // Let's make sure that we're not out of bounds as we also need to make space to accomodate the
        // other two body pieces
        while ((rndX - snake.length) < 0) {
            rndX = Math.round(Math.random()*15+4);
        }
        
        for (var i = 0; i < snake.length; i++) {
            snake[i] = { x: rndX - i, y: rndY };
            map[rndX - i][rndY] = 2;
        }

        return map;
    }

    function showGameOver()
    {
        // Disable the game.
        active = false;

        // Clear the canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.fillStyle = 'red';
        ctx.font = '16px sans-serif';
        
        ctx.fillText('Game Over!', ((canvas.width / 2) - (ctx.measureText('Game Over!').width / 2)), 50);

        ctx.font = '12px sans-serif';

        ctx.fillText('Your Score Was: ' + score, ((canvas.width / 2) - (ctx.measureText('Your Score Was: ' + score).width / 2)), 70);
       
        ctx.fillRect((canvas.width - ctx.measureText('Stand here to restart').width)/2-1, 86, ctx.measureText('Stand here to restart').width+3, 10+3);
        
        ctx.fillStyle = 'black';
        ctx.fillText('Stand here to restart', (canvas.width - ctx.measureText('Stand here to restart').width)/2, 192/2);
        
        setTimeout(Restart,1000)
    }

    
};
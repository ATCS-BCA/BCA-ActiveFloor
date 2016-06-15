var canvasContext;
const cellWidth = 23;
const cellHeight = 23;
const cellRow = 4;
const cellCol = 4;
var blocksX = [];
var blocksY = [];
var blocksNum = [];
var movable = [];
var xSpace = 15;
var ySpace = 24;
var blockInterval = 30;
var start = true;
var moving = false;

window.onload = function(){	
	canvas = document.getElementById('floorCanvas');
	canvasContext = canvas.getContext("2d");
	
	var framesPerSecond = 60;
	initBoard();
	getRandomBoard();
	console.log(checkIfMovable(0))
	setInterval(function() {
		//scramble();		
		drawBoard();
	} , 1000/framesPerSecond);
	
	
};

function initBoard(){
	var count = 1;
	for(var i = ySpace; i < 4 * blockInterval; i += blockInterval){
		for(var j = xSpace; j < 4 * blockInterval; j += blockInterval){
			if(count === 16){
				break;
			}
			
			drawBox(j,i,"white",count);
			blocksX[count - 1] = j;
			blocksY[count - 1] = i;
			count++;
		}
	}
	
	canvasContext.fillStyle = "red";
	canvasContext.fillText("Slide Puzzle!",16,16);
	canvasContext.fillStyle = "yellow";
	canvasContext.fillText("?",137,140);
	
}

function drawBoard(){
	//clearAll();
	can = canvas.getContext("2d");
	can.clearRect(0,0,400,400);
	var count = 1;
	for(var i = 0; i < blocksX.length;i++){
		/*
		if(i === 15){
			break;
		}
		else{
		*/
			drawBox(blocksX[i],blocksY[i],"white",count);
		
		count++;
		
	}
		
	canvasContext.fillStyle = "red";
	canvasContext.fillText("Slide Puzzle!",16,16);
	canvasContext.fillStyle = "yellow";
	canvasContext.fillText("?",137,140);
	
}

function moveBlock(num,dir){
	if(dir === "right"){
		var x = ((num % 4 + 1)) * blockInterval + xSpace;
		if(blocksX[num] <= x){
			blocksX[num] += 1;
		}
		
	}
	else if(dir === "left"){
		var x = ( (num % 4 - 1)) * blockInterval + xSpace;
		if(blocksX[num] >= x){
			blocksX[num] -= 1;
		}
		
	}
	else if(dir === "up"){
		var y = (num % 4 + 2) * blockInterval + ySpace;
		if(blocksY[num] >= y){
			blocksY[num] -= 1;
		}
		
	}
	else if(dir === "down"){
		var y = ( (num % 4 + 2)) * blockInterval + ySpace;
		if(blocksY[num] <= y){
			blocksY[num] += 1;
		}
		
	}	
}

		
/*
function scramble(){
	var movArr = [];
	
	/*
	for(var i = 0; i < blocksX.length; i++){
		movArr = checkIfMovable(i);
		if(movArr[0]){
			moveBlock(i,"right");
		}			
		else if(movArr[1]){
			moving = true;
			moveBlock(i,"left");
		}	 
		else if(movArr[2]){
			moving = true;
			moveBlock(i,"up");
		}
		else if(movArr[3]){
			moving = true;
			moveBlock(i,"down");
		}
	}
	
	for(var i = 0; i < 15; i++){
		var tempArr = [];
		tempArr = checkIfMovable(i);
		dirMove(i,tempArr[0],tempArr[1],tempArr[2],tempArr[3]);
	}
		
	
	start = false;
}

function dirMove(i,r,l,u,d){
	//console.log(i + " " + tempArr[i])
	if (r){
		moveBlock(i, "right");
	}
	else if (l){
		moveBlock(i, "left");	
	
	}
	else if (u){
		moveBlock(i, "up")
	}
	else if (d){
		moveBlock(i, "down");
	}
}
/
*/

function getRandomBoard(){
	var newBlocksX = [];
	var newBlocksY = [];	
	var numHolder = [];
	for(var i = 0; i < 15; i++){
		numHolder[i] = i;
	}
	for(var i = 0; i < blocksX.length;i++){
		//keep generating num until new num
		var num = Math.floor(Math.random() * (14 + 1));
		
		newBlocksX[i] = blocksX[num];
		newBlocksY[i] = blocksY[num];
			//blocksX[num] = null;
			//blocksY[num] = null;
		
	}
		blocksX = newBlocksX;
		blocksY = newBlocksY;

}
function checkIfMovable(num){
	moveRight = true;
	moveLeft = true;
	moveUp = true;
	moveDown = true;
	
	for(var i = 0; i < blocksX.length;i++){
		//Checking for a block on the right
		if(blocksX[num] + blockInterval === blocksX[i] && blocksY[num] === blocksY[i]){
			
			moveRight = false;	
			
		}
		else if(blocksX[num] - blockInterval === blocksX[i] && blocksY[num] === blocksY[i]){
			
			moveLeft = false;
		}
		else if(blocksY[num] - blockInterval === blocksY[i] && blocksX[num] === blocksX[i]){
			
			moveUp = false;

		}
		else if(blocksY[num] + blockInterval === blocksY[i] && blocksX[num] === blocksX[i]){
			
			moveDown = false;
		
		}

		//Checking if off board
		if(blocksX[num] + blockInterval >= blockInterval * 4 + xSpace){
			moveRight = false;
		}
		if(blocksX[num] - blockInterval <= xSpace){
			moveLeft = false;
		}
		//FIX Up TESTER
		if(blocksY[num] - blockInterval < 0){
			moveUp = false;
		}
						
		if(blocksY[num] + blockInterval >= blockInterval * 4){
			moveDown = false;
		}
	}						
	movable = [moveRight,moveLeft,moveUp,moveDown];	
	

	return movable ;
}


function giveUp(){

}

function checkIfGameWon(){
	//blocksX = solved x
	//blocksY = solved y
	//gameWon()
}

function gameWon(){
	
}

function drawBox(x,y,color,text){
	this.text = text;
	canvasContext.font = '18px sans-serif';
	canvasContext.fillStyle = color;
	canvasContext.fillRect(x,y,cellWidth,cellHeight);
	canvasContext.fillStyle = 'blue';
	canvasContext.fillText(text,x + 3,y + 18);
	
}
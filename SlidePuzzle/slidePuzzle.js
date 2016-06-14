var canvasContext;
const cellWidth = 25;
const cellHeight = 25;
const cellRow = 4;
const cellCol = 4;
var blocksX = [];
var blocksY = [];
var blocksNum = [];
const blockInterval = 30;

window.onload = function(){	
	canvas = document.getElementById('floorCanvas');
	canvasContext = canvas.getContext("2d");
	
	var framesPerSecond = 5;
	initBoard();
	setInterval(function() {
		//move(14);
		drawBoard();
	} , 1000/framesPerSecond);
	
	
};

	
function initBoard(){
	var count = 1;
	for(var i = 24; i < 4 * blockInterval; i += blockInterval){
		for(var j = 15; j < 4 * blockInterval; j += blockInterval){
			if(count===16){break;}
			
			drawBox(j,i,"white",count);
			blocksX[count - 1] = j;
			blocksY[count - 1] = i;
			blocksNum[count - 1] = count;
			count++;
		}
	}
	canvasContext.fillStyle = "red";
	canvasContext.fillText("Slide Puzzle!",16,16);
	canvasContext.fillStyle = "yellow";
	canvasContext.fillText("?",135,140);
}

function drawBoard(){

	var count = 1;
	for(var i = 0; i < blocksX.length;i++){
		drawBox(blocksX[i],blocksY[i],"white",count);
		count++;
		
	}
		
	
}

function move(num){
	var x = blocksX[num];
	while(blocksX[num] <= x + 30){
		blocksX[num] += 1;
	}
}

function checkIfMovable(num){
	for(var i = 0; i < blocksX.length;i++){
		//Checking for a block on the right
		if(blocksX[num] + blockInterval === blocksX[i] && blocksY[num] === blocksY[i]){
			//Checking for a block on the left
			if(blocksX[num] - blockInterval === blocksX[i] && blocksY[num] === blocksY[i]){
				//Checking for a block on the top
				if(blocksY[num] - blockInterval === blocksX[i] && blocksX[num] === blocksX[i]){
					//Checking for a block on the bottom
					if(blocksY[num] - blockInterval === blocksX[i] && blocksX[num] === blocksX[i]){
						
					}	
				}			
			}
		}
	}

	return true;
}


function giveUp(){

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
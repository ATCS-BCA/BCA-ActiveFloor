var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;

var refreshTime = 17;
var canvasContext;
const cellWidth = 24;
const cellHeight = 24;
const cellRow = 4;
const cellCol = 4;
var blocksX = [];
var blocksY = [];
var blocksNum = [];
var movable = [];
var isMovable = true;
var xSpace = 17;
var ySpace = 17;
var blockInterval = 46;
var start = true;
var moving = false;
var moveStart = 0;
var sensorArrSplit = ["2,3","7,8","13,14","18,19"];
var sensorArr = [2,3,7,8,13,14,18,19];
var sensorArr1 = [2,7,13,19];
var sensorArr2 = [3,8,14,20];
var sensorArrStart = [2,7,13,19];
var sensorArrEnd = [8,13,19,23];
var blocksXInit = [];
var blocksYInit = [];
var blocksXSolved = [];
var blocksYSolved = [];
var blockNum;



window.onload = function(){	
	canvas = document.getElementById('floorCanvas');
	canvasContext = canvas.getContext("2d");
	var framesPerSecond = 60;
	initBoard();
	getRandomBoard();
	/*
	setInterval(function() {
		//scramble();		
		drawBoard();
		
	} , 1000/framesPerSecond);
	*/
};

function refreshXML() {
    'use strict';
    $.get('http://HK-138-01.bergen.org:8080/', function (data) {
        dataHolderArray = [];
				
        $(data).find('BLFloor').each(function () {
            $item = $(this);
            ledsX = $item.attr('ledsX');
            ledsY = $item.attr('ledsY');
            sensorsX = $item.attr('sensorsX');
            sensorsY = $item.attr('sensorsY');
            ledPerSensorX = (ledsX / sensorsX);
            ledPerSensorY = (ledsY / sensorsY);
            xCenter = ledPerSensorX / 2;
            yCenter = ledPerSensorY / 2;

        });
				
        $(data).find('Row').each(function () {
            var $row, rowNum, rowVal, n;
            $row = $(this);
            rowNum = $row.attr('rownum');
            rowVal = $row.attr('values');
            n = rowVal.split(charDivide).join('');
				
            dataHolderArray.push(n);
        });
        moveStart = 0;
        drawBoard(dataHolderArray);
    });
}

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
	blocksXSolved = blocksX;
	blocksYSolved = blocksY;
	
	
}

function findBlockNum(x,y){
	for(var i = 0; i < blocksX.length; i++){
		if(x === (blocksX[i] ) && y === blocksY[i]){
			
			return i;
		}	
		
		
	}
}

function drawBoard(dataArr){
	//clearAll();
	var count = 1;
	var blockX;
	var blockY;
	//console.log(dataArr);

	
	//checking for touch
	for(var i = 0; i < dataArr.length; i++){
		for(var j = 0; j < dataArr[i].length; j++){
			if(dataArr[i][j] === "*" && searchForMove(j,i) ){
				blockNum = findSensorBlock(j,i);
				moveBlockSimple(blockNum);
				//break;
				/*if(checkIfMovable(blockNum)){
					moveBlockSimple(blockNum);
					break;
				}*/	
			}
		}
	}
	can = canvas.getContext("2d");
	can.clearRect(0,0,canvas.width,canvas.height);
	
	for(var i = 0; i < blocksX.length;i++){
		drawBox(blocksX[i],blocksY[i],"white",count);
		
		count++;
		
	}
	checkIfGameWon();

	//canvasContext.fillStyle = "red";
	//canvasContext.fillText("Slide Puzzle!",ledsX/4 - 10,16);
	canvasContext.fillText("Slide Puzzle!",canvas.width/4,canvas.height/14);	
	canvasContext.fillStyle = "yellow";
	canvasContext.fillText("?",canvas.width*10/11,canvas.height*10/11);
	
}
function searchForMove(x,y){
	for(var i = 0; i < sensorArr.length; i++){
		for(var j = 0; j < sensorArr.length; j++){
			if(x === sensorArr[i] && y === sensorArr[j]){
				return true;
			}
				
		}
		
	}
	return false;			
}

function findSensorBlock(x,y){
	var tempX;
	var tempY;
	var block;

	for(var i = 0; i < sensorArr1.length;i++){
		if(x >= sensorArrStart[i] && x <= sensorArrEnd[i]){
			tempX = i;
		}
		if(y >= sensorArrStart[i] && y <= sensorArrEnd[i]){
			tempY = i;
		}
	}
	tempX = (tempX * blockInterval) + xSpace;
	tempY = (tempY * blockInterval) + ySpace;	
	block = findBlockNum(tempX,tempY);
	return block;
}

function moveBlock(num){
	//fix resesting moveStart
	var blockMoveDir = [];
	var dir = "";

	blockMoveDir = checkDirMove(blockNum);
	
	if(blockMoveDir[0]){
		dir = "right";
	}
	else if(blockMoveDir[1]){
		dir = "left";
	}
	else if(blockMoveDir[2]){
		dir = "up";
	}
	else if(blockMoveDir[3]){
		dir = "down";
	}
					
	if(dir === "right"){
		var x = blockInterval;
		if(moveStart <= x){
			blocksX[num] += 1;
			moveStart+=1;
		}
	}
	else if(dir === "left"){
		var x = blockInterval;
		if(moveStart <= x){
			blocksX[num] -= 1;
			moveStart+=1;	
		}
	}
	else if(dir === "up"){
		var y = blockInterval;
		if(moveStart <= y){
			blocksY[num] -= 1;
			moveStart+=1;
		}
	}
	else if(dir === "down"){
		var y = blockInterval;
		if(moveStart <= y){
			blocksY[num] += 1;
			moveStart+=1;
		}
			
	}
	
}

function moveBlockSimple(num){
	//fix resesting moveStart
	var blockMoveDir = [];
	var dir = "";
	blockMoveDir = checkDirMove(num);
	
	if(blockMoveDir[0]){
		dir = "right";
	}
	else if(blockMoveDir[1]){
		dir = "left";
	}
	else if(blockMoveDir[2]){
		dir = "up";
	}
	else if(blockMoveDir[3]){
		dir = "down";
	}


	if(dir === "right"){
		blocksX[num] += blockInterval;	
	}
	else if(dir === "left"){
		blocksX[num] -= blockInterval;	
	}
	else if(dir === "up"){
		blocksY[num] -= blockInterval;
		
	}
	else if(dir === "down"){
		blocksY[num] += blockInterval;
			
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

function checkInArray(num,numHolder){
	for(var i = 0; i < 15; i++){
		if(numHolder[i] == num){
			return true;
		}
	}
	return false;
}

function getRandomBoard(){
	var newBlocksX = [];
	var newBlocksY = [];	
	var numHolder = [];
	/*
	for(var i = 0; i < 15; i++){
		numHolder[i] = i;
	}
	*/
	for(var i = 0; i < blocksX.length;i++){
		//keep generating num until new num
		var isNewNum = false;
		while(!isNewNum){
			var num = Math.floor(Math.random() * (14 + 1));
			if(!checkInArray(num,numHolder)){
			newBlocksX[i] = blocksX[num];
			newBlocksY[i] = blocksY[num];
			numHolder[numHolder.length] = num;
			isNewNum = true;
			}
		}	
		
			//blocksX[num] = null;
			//blocksY[num] = null;
		
	}	
		blocksX = newBlocksX;
		blocksY = newBlocksY;
		blocksXInit = blocksX;
		blocksYInit = blocksY;

}
function checkDirMove(num){
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
		if(blocksX[num] - blockInterval < xSpace){
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
function checkIfMovable(num){
	isMovable = true;
	for(var i = 0; i < blocksX.length;i++){
		//Checking for a block on the right
		if(blocksX[num] + blockInterval === blocksX[i] && blocksY[num] === blocksY[i]){
			
			isMovable = false;	
			
		}
		else if(blocksX[num] - blockInterval === blocksX[i] && blocksY[num] === blocksY[i]){
			
			isMovable = false;
		}
		else if(blocksY[num] - blockInterval === blocksY[i] && blocksX[num] === blocksX[i]){
			
			isMovable = false;

		}
		else if(blocksY[num] + blockInterval === blocksY[i] && blocksX[num] === blocksX[i]){
			
			isMovable = false;
		
		}

		//Checking if off board
		if(blocksX[num] + blockInterval >= blockInterval * 4 + xSpace){
			isMovable = false;
		}
		if(blocksX[num] - blockInterval <= xSpace){
			isMovable = false;
		}
		if(blocksY[num] - blockInterval <= 0){
			isMovable = false;
		}
						
		if(blocksY[num] + blockInterval >= blockInterval * 4){
			isMovable = false;
		}
	}						

	return isMovable;
}

function giveUp(){

}

function checkIfGameWon(){
	for(var i = 0; i < blocksX; i++){
		if(blocksX[i] !== blocksXSolved[i] || blocksY[i] !== blocksYSolved[i]){
			gameWon();
		}
	}
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
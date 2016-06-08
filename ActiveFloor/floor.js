/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 80;
var pastTile;
var currentTile;
var nextTile;
var tileArr = [];
var tempcounter = 1;
var counter = 0;
var numOfSteps = 6;
var arr = generateTileArr();

function drawObj(type, xPos, yPos, size, myArr) {
    'use strict';
    context2D.fillStyle = 'red';

    if (type === 'square') {
        context2D.fillRect((xPos + (xCenter / size)), (yPos + (yCenter / size)), size, size);
    } else if (type === 'circle') {
        context2D.beginPath();
        context2D.arc((xPos + xCenter), (yPos + yCenter), size, 0, Math.PI * 2, true);
        context2D.closePath();
        context2D.fill();
    }

    //ADD CONDITIONS ON BOTH SIDES SMALLER AND GREATER

    if((yPos + (yCenter / size)) < 30){
        if((xPos + (xCenter / size)) < 30){
            var css = '#zero { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#zero";
        }
        if((xPos + (xCenter / size)) < 61 && (xPos + (xCenter / size)) > 30){
            var css = '#one { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#one";
        }
        if((xPos + (xCenter / size)) < 92 && (xPos + (xCenter / size)) > 61){
            var css = '#two { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#two";
        }
        if((xPos + (xCenter / size)) < 123 && (xPos + (xCenter / size)) > 92){
            var css = '#three { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#three";
        }
        if((xPos + (xCenter / size)) < 154 && (xPos + (xCenter / size)) > 123){
            var css = '#four { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#four";
        }
        if((xPos + (xCenter / size)) > 154) {
            var css = '#five { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#five";
        }
    }

    if((yPos + (yCenter / size)) < 61 && (yPos + (yCenter / size)) > 30){
        if((xPos + (xCenter / size)) < 30){
            var css = '#six { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#six";
        }
        if((xPos + (xCenter / size)) < 61 && (xPos + (xCenter / size)) > 30){
            var css = '#seven { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#seven";
        }
        if((xPos + (xCenter / size)) < 92 && (xPos + (xCenter / size)) > 61){
            var css = '#eight { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#eight";
        }
        if((xPos + (xCenter / size)) < 123 && (xPos + (xCenter / size)) > 92){
            var css = '#nine { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#nine";
        }
        if((xPos + (xCenter / size)) < 154 && (xPos + (xCenter / size)) > 123){
            var css = '#ten { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#ten";
        }
        if((xPos + (xCenter / size)) > 154) {
            var css = '#eleven { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#eleven";
        }
    }

    if((yPos + (yCenter / size)) < 92 && (yPos + (yCenter / size)) > 61){
        if((xPos + (xCenter / size)) < 30){
            var css = '#twelve { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twelve";
        }
        if((xPos + (xCenter / size)) < 61 && (xPos + (xCenter / size)) > 30){
            var css = '#thirteen { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#thirteen";
        }
        if((xPos + (xCenter / size)) < 92 && (xPos + (xCenter / size)) > 61){
            var css = '#fourteen { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#fourteen";
        }
        if((xPos + (xCenter / size)) < 123 && (xPos + (xCenter / size)) > 92){
            var css = '#fifteen { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#fifteen";
        }
        if((xPos + (xCenter / size)) < 154 && (xPos + (xCenter / size)) > 123){
            var css = '#sixteen { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#sixteen";
        }
        if((xPos + (xCenter / size)) > 154) {
            var css = '#seventeen { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#seventeen";
        }
    }

    if((yPos + (yCenter / size)) < 123 && (yPos + (yCenter / size)) > 92){
        if((xPos + (xCenter / size)) < 30){
            var css = '#eighteen { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#eighteen";
        }
        if((xPos + (xCenter / size)) < 61 && (xPos + (xCenter / size)) > 30){
            var css = '#nineteen { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#nineteen";
        }
        if((xPos + (xCenter / size)) < 92 && (xPos + (xCenter / size)) > 61){
            var css = '#twenty { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twenty";
        }
        if((xPos + (xCenter / size)) < 123 && (xPos + (xCenter / size)) > 92){
            var css = '#twentyone { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentyone";
        }
        if((xPos + (xCenter / size)) < 154 && (xPos + (xCenter / size)) > 123){
            var css = '#twentytwo { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentytwo";
        }
        if((xPos + (xCenter / size)) > 154) {
            var css = '#twentythree { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentythree";
        }
    }

    if((yPos + (yCenter / size)) < 154 && (yPos + (yCenter / size)) > 123){
        if((xPos + (xCenter / size)) < 30){
            var css = '#twentyfour { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentyfour";
        }
        if((xPos + (xCenter / size)) < 61 && (xPos + (xCenter / size)) > 30){
            var css = '#twentyfive { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentyfive";
        }
        if((xPos + (xCenter / size)) < 92 && (xPos + (xCenter / size)) > 61){
            var css = '#twentysix { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentysix";
        }
        if((xPos + (xCenter / size)) < 123 && (xPos + (xCenter / size)) > 92){
            var css = '#twentyseven { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentyseven";
        }
        if((xPos + (xCenter / size)) < 154 && (xPos + (xCenter / size)) > 123){
            var css = '#twentyeight { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentyeight";
        }
        if((xPos + (xCenter / size)) > 154) {
            var css = '#twentynine { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#twentynine";
        }
    }

    if((yPos + (yCenter / size)) > 154){
        if((xPos + (xCenter / size)) < 30){
            var css = '#thirty { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#thirty";
        }
        if((xPos + (xCenter / size)) < 61 && (xPos + (xCenter / size)) > 30){
            var css = '#thirtyone { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#thirtyone";
        }
        if((xPos + (xCenter / size)) < 92 && (xPos + (xCenter / size)) > 61){
            var css = '#thirtytwo { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#thirtytwo";
        }
        if((xPos + (xCenter / size)) < 123 && (xPos + (xCenter / size)) > 92){
            var css = '#thirtythree { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#thirtythree";
        }
        if((xPos + (xCenter / size)) < 154 && (xPos + (xCenter / size)) > 123){
            var css = '#thirtyfour { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#thirtyfour";
        }
        if((xPos + (xCenter / size)) > 154) {
            var css = '#thirtyfive { background: red; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            currentTile = "#thirtyfive";
        }
    }

    if(tempcounter === 0){
        getAdjacentTile(currentTile);
        tempcounter++;
    }


    //var arr = generateTileArr();
    if(currentTile.localeCompare(arr[counter]) === 0){
        if(counter === 0){
            nextTile = arr[counter + 1];
        }
        else if(counter < arr.length - 1){
            pastTile = arr[counter - 1];
            nextTile = arr[counter + 1];
        }
        else {
            done();
        }
    }
    else if(currentTile.localeCompare(arr[counter - 1]) === 0){
        currentTile === arr[counter];
        counter--;
        if(counter > 0){
            pastTile = arr[counter - 1];
            nextTile = arr[counter + 1];
        }
        else{
            pastTile = null;
            nextTile = arr[counter + 1];
        }
    }

    else if(currentTile.localeCompare(arr[counter + 1]) === 0){
        counter++;
        pastTile = arr[counter - 1];
        if(counter === arr.length - 1){
            done();
        }
        else {
            nextTile = arr[counter + 1];
        }
    }
    else {
        fail();
    }

    //192 pixels

    //0,0
    //184,0
    //184,184
    
    
}

function generateTileArr(){
    var tileArr = [];
    tileArr.push("#thirtytwo");
    tileArr.push(getAdjacentTile("#thirtytwo"));
    for(var i = 2; i < numOfSteps; i++){
        var temptile = getAdjacentTile(tileArr[i - 1]);
        while(temptile === tileArr[i - 2]){
            temptile = getAdjacentTile(tileArr[i-1]);
        }
        tileArr.push(temptile);
    }

    for(var i = 0; i < numOfSteps; i++){
        var css = tileArr[i].concat(' { background: purple; }'),
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
    }
    /*
    tileArr.push("#twentysix");
    tileArr.push("#twenty");
    tileArr.push("#fourteen");
    tileArr.push("#eight");
    tileArr.push("#two");
    */

    return tileArr;
    //make random generator
}


function displayPrompt(){
    var css = tileArr[i].concat(' { background: url(images/N-Ex.gif) }'),
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
}

function getAdjacentTile(tile){
    var tileNum = nameToNumber(tile);
    var possibleTiles = [];

    if(tileNum > 5){
        possibleTiles.push(numberToName(tileNum - 6));

        if(tileNum % 6 !== 0){
            possibleTiles.push(numberToName(tileNum - 7));
        }
        if(tileNum % 6 !== 5){
            possibleTiles.push(numberToName(tileNum - 5));
        }
    } 
    
    if(tileNum % 6 !== 0){
        possibleTiles.push(numberToName(tileNum - 1));
    }
    if(tileNum % 6 !== 5){
        possibleTiles.push(numberToName(tileNum + 1));
    }

    if(tileNum < 30){
        possibleTiles.push(numberToName(tileNum + 6));

        if(tileNum % 6 !== 0){
            possibleTiles.push(numberToName(tileNum + 5));
        }
        if(tileNum % 6 !== 5){
            possibleTiles.push(numberToName(tileNum + 7));
        }
    } 

    var randomNum = Math.random();
    for(var i = 0; i < possibleTiles.length; i++){
        if(randomNum < (1 / possibleTiles.length) * (i + 1)){
            /*
            var css = possibleTiles[i].concat(" { background: green; }"),
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);

            randomNum = 3;
            */
            return possibleTiles[i];

            randomNum = 3;
        }
    }
    /*
    for(var i = 0; i < 36; i++){
        if($.inArray(numberToName(i), possibleTiles) >= 0){
            var css = numberToName(i).concat(' { background: green; }'),
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
        }
    }
    */
}

function nameToNumber(tileName){
    if(tileName === "#zero"){
        return 0;
    }
    else if(tileName === "#one"){
        return 1;
    }
    else if(tileName === "#two"){
        return 2;
    }
    else if(tileName === "#three"){
        return 3;
    }
    else if(tileName === "#four"){
        return 4;
    }
    else if(tileName === "#five"){
        return 5;
    }
    else if(tileName === "#six"){
        return 6;
    }
    else if(tileName === "#seven"){
        return 7;
    }
    else if(tileName === "#eight"){
        return 8;
    }
    else if(tileName === "#nine"){
        return 9;
    }
    else if(tileName === "#ten"){
        return 10;
    }
    else if(tileName === "#eleven"){
        return 11;
    }
    else if(tileName === "#twelve"){
        return 12;
    }
    else if(tileName === "#thirteen"){
        return 13;
    }
    else if(tileName === "#fourteen"){
        return 14;
    }
    else if(tileName === "#fifteen"){
        return 15;
    }
    else if(tileName === "#sixteen"){
        return 16;
    }
    else if(tileName === "#seventeen"){
        return 17;
    }
    else if(tileName === "#eighteen"){
        return 18;
    }
    else if(tileName === "#nineteen"){
        return 19;
    }
    else if(tileName === "#twenty"){
        return 20;
    }
    else if(tileName === "#twentyone"){
        return 21;
    }
    else if(tileName === "#twentytwo"){
        return 22;
    }
    else if(tileName === "#twentythree"){
        return 23;
    }
    else if(tileName === "#twentyfour"){
        return 24;
    }
    else if(tileName === "#twentyfive"){
        return 25;
    }
    else if(tileName === "#twentysix"){
        return 26;
    }
    else if(tileName === "#twentyseven"){
        return 27;
    }
    else if(tileName === "#twentyeight"){
        return 28;
    }
    else if(tileName === "#twentynine"){
        return 29;
    }
    else if(tileName === "#thirty"){
        return 30;
    }
    else if(tileName === "#thirtyone"){
        return 31;
    }
    else if(tileName === "#thirtytwo"){
        return 32;
    }
    else if(tileName === "#thirtythree"){
        return 33;
    }
    else if(tileName === "#thirtyfour"){
        return 34;
    }
    else if(tileName === "#thirtyfive"){
        return 35;
    }
    else {
        //create some exit method
    }
}

function numberToName(tileNum){
    if(tileNum === 0){
        return "#zero";
    }
    else if(tileNum === 1){
        return "#one";
    }
    else if(tileNum === 2){
        return "#two";
    }
    else if(tileNum === 3){
        return "#three";
    }
    else if(tileNum === 4){
        return "#four";
    }
    else if(tileNum === 5){
        return "#five";
    }
    else if(tileNum === 6){
        return "#six";
    }
    else if(tileNum === 7){
        return "#seven";
    }
    else if(tileNum === 8){
        return "#eight";
    }
    else if(tileNum === 9){
        return "#nine";
    }
    else if(tileNum === 10){
        return "#ten";
    }
    else if(tileNum === 11){
        return "#eleven";
    }
    else if(tileNum === 12){
        return "#twelve";
    }
    else if(tileNum === 13){
        return "#thirteen";
    }
    else if(tileNum === 14){
        return "#fourteen";
    }
    else if(tileNum === 15){
        return "#fifteen";
    }
    else if(tileNum === 16){
        return "#sixteen";
    }
    else if(tileNum === 17){
        return "#seventeen";
    }
    else if(tileNum === 18){
        return "#eighteen";
    }
    else if(tileNum === 19){
        return "#nineteen";
    }
    else if(tileNum === 20){
        return "#twenty";
    }
    else if(tileNum === 21){
        return "#twentyone";
    }
    else if(tileNum === 22){
        return "#twentytwo";
    }
    else if(tileNum === 23){
        return "#twentythree";
    }
    else if(tileNum === 24){
        return "#twentyfour";
    }
    else if(tileNum === 25){
        return "#twentyfive";
    }
    else if(tileNum === 26){
        return "#twentysix";
    }
    else if(tileNum === 27){
        return "#twentyseven";
    }
    else if(tileNum === 28){
        return "#twentyeight";
    }
    else if(tileNum === 29){
        return "#twentynine";
    }
    else if(tileNum === 30){
        return "#thirty";
    }
    else if(tileNum === 31){
        return "#thirtyone";
    }
    else if(tileNum === 32){
        return "#thirtytwo";
    }
    else if(tileNum === 33){
        return "#thirtythree";
    }
    else if(tileNum === 34){
        return "#thirtyfour";
    }
    else if(tileNum === 35){
        return "#thirtyfive";
    }
    else {
        //exit method
    }
}

function done(){
    var css = '#thirtyfive { background: blue; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
}

function fail(){
    var css = '#thirtyfive { background: white; }',
            head = document.head || document.getElementsByTagName('head')[0],
            style = document.createElement('style');

            style.type = 'text/css';
            if (style.styleSheet){
                style.styleSheet.cssText = css;
            } else {
            style.appendChild(document.createTextNode(css));
            }

            head.appendChild(style);
}

function initCanvas(arr) {
    'use strict';
    canvas = document.getElementById('floorCanvas');
    canvas.width = ledsX;
    canvas.height = ledsY;
    context2D = canvas.getContext('2d');
    var myArr = [];
    
    var i, tempRow, p, srchStr, tempX, tempY;
    for (i = 0; i < arr.length; i += 1) {
        myArr[i] = (tempX, tempY);
        tempRow = arr[i];
        
        for (p = 0; p < tempRow.length; p += 1) {
            srchStr = tempRow.substring(p, p + 1);
            if (srchStr === charSearch) {
                tempX = p * ledPerSensorX;
                tempY = i * ledPerSensorY;
				drawObj('square', tempX, tempY, 5, myArr);
            }
        }
    }
}


function refreshXML() {
    'use strict';
	// change IP address to match ActiveFloor server address
    $.get('http://10.31.34.74:8080/', function (data) {
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
			
        initCanvas(dataHolderArray);
    });
}

$(document).ready(function () {
    'use strict';
    startRefresh();
});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {refreshXML(); }, refreshTime);
}





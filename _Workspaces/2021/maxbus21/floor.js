/*jslint browser: true*/
/*global $, jQuery*/
var myInterval;
//stuff to move to seperate file
var nummoles=0;
var redraw=0;
var posofmoles=[
    [0,0],
    [0,0],
    [0,0],
    [0,0],
    [0,0]
];
var score=0;
var time=0;
var gameover=false;

var $item, ledsX, ledsY, sensorsX, sensorsY, ledPerSensorX, ledPerSensorY, xCenter, yCenter;
var dataHolderArray = [];
var charSearch = '*';
var charDivide = ',';
var canvas, context2D;
var refreshTime = 17;       // Run the loop every 17 milliseconds

function drawObj(type, xPos, yPos, size) {
    'use strict';
    context2D.fillStyle = 'blue';

    if (type === 'square') {
        context2D.fillRect((xPos + (xCenter / size)), (yPos + (yCenter / size)), size, size);
    }
    else if (type === 'circle') {
        context2D.beginPath();
        context2D.arc((xPos + xCenter), (yPos + yCenter), size, 0, Math.PI * 2, true);
        context2D.closePath();
        context2D.fill();
    }

    else if(type==='Mole'){

        if(nummoles<5&&redraw<5){
            posofmoles[redraw][0]=(Math.random()*canvas.width-(canvas.width/10))+(canvas.width/20);
            posofmoles[redraw][1]=(Math.random()*canvas.height-(canvas.height/10))+(canvas.height/20);
            nummoles++;
            if(nummoles>=5){
                redraw=10;
            }
            else{
                redraw++;
            }
        }

        for(var i=0;i<nummoles;i++ ){
            drawObj('circle',posofmoles[i][0], posofmoles[i][1],5)
        }
        if(nummoles>=5){
            var dies = Math.random()*200;
            if(dies<5){
                redraw=Math.floor(dies);
                nummoles=4;

            }
        }


    }

}

function drawCanvas(arr) {
    'use strict';
    canvas = document.getElementById('floorCanvas');
    canvas.width = ledsX;
    canvas.height = ledsY;
    context2D = canvas.getContext('2d');
    gameover=(time>=30);
    if (!gameover) {
        drawObj('Mole', canvas.width / 2, canvas.height / 2, 5);
        context2D.fillStyle = '#2ecc71';
        context2D.font = '10px Arial';
        context2D.fillText('Score: ' + score,
            canvas.width - context2D.measureText('Score:' + score).width - canvas.width / 1.7, canvas.height / 25);

        time += 0.017;
        context2D.fillStyle = '#2ecc71';
        context2D.font = '10px Arial';
        context2D.fillText('Time Left: ' + Math.floor((30 - time)),
            canvas.width - context2D.measureText('Time Left:' + Math.floor((30 - time))).width - canvas.width / 5, canvas.height / 25);
    }
    else {
        posofmoles=[[0,0], [0,0], [0,0], [0,0], [0,0]];

        context2D.strokeStyle = 'blue';
        context2D.strokeRect(canvas.width/3,canvas.height*4/10, canvas.width/3, canvas.height/10);

        context2D.fillStyle = '#2ecc71';
        context2D.font = '10px Arial';
        context2D.fillText('Score: ' + score,
            canvas.width - context2D.measureText('Score:' + score).width - canvas.width /2.5, canvas.height /4);
        context2D.fillStyle = '#2ecc71';
        context2D.font = '10px Arial';
        context2D.fillText('Play Again',
            canvas.width - context2D.measureText("Play Again").width - canvas.width /2.7, canvas.height*9 /20);

    }
    var i, tempRow, p, srchStr, tempX, tempY;
    for (i = 0; i < arr.length; i += 1) {
        tempRow = arr[i];
        
        for (p = 0; p < tempRow.length; p += 1) {
            srchStr = tempRow.substring(p, p + 1);
            if (srchStr === charSearch) {
                tempX = p * ledPerSensorX;
                tempY = i * ledPerSensorY;
                if(gameover) {
                    if (canvas.width/3<= tempX && (2*canvas.width/3) >= tempX
                        && canvas.height*4/10 <= tempY && (canvas.height/2)  >= tempY) {
                            gameover=false;
                            nummoles=0;
                            redraw=0;
                            time=0;
                            score=0;
                    }

                }
                else {
                    for (var c = 0; c < posofmoles.length; c++) {
                        if (posofmoles[c][0] <= tempX + 5 && posofmoles[c][0] >= tempX - 5
                            && posofmoles[c][1] <= tempY + 5 && posofmoles[c][1] >= tempY - 5) {
                            redraw = c;
                            nummoles = 4;
                            score++;
                        }
                    }
                }
            }
        }
    }


}

function loop() {
    'use strict';
    $.get('http://HK-138-01.bergen.org:8080/', function (data) {
        dataHolderArray = [];

        /* Assign the fields from the XML to Javascript variables. */
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

        /* Load the data from the XML file into the dataHolderArray */
        $(data).find('Row').each(function () {
            var $row, rowNum, rowVal, n;
            $row = $(this);
            rowNum = $row.attr('rownum');
            rowVal = $row.attr('values');
            n = rowVal.split(charDivide).join('');
				
            dataHolderArray.push(n);
        });

        /* Redraw the screen based upon the data in the array. */
        drawCanvas(dataHolderArray);
    });
}

$(document).ready(function () {
    'use strict';
    
    // Start getting floor data automatically (assuming Floor Server is running).
    startRefresh();
    
    sendSemaphore(function() {
        // Clear spacing and borders.
        $("body").addClass("app");
        $("div").addClass("app");
        $("#floorCanvas").addClass("app");
        
    });
});

function startRefresh() {
    'use strict';
    myInterval = setInterval(function () {loop(); }, refreshTime);
}

function stopRefresh() {
    'use strict';
    clearInterval(myInterval);
}

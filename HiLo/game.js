/* sendSemaphore() is necessary to interact with the active floor */

sendSemaphore(function() {
    $("#canvas").addClass("app")

})

/* This is a floor object to retrieve and parse the active floor input.
[Methods]
.getTiles()
.tilePos(x, y)
==============
.getTiles():
	Iterates through the floor and stores the values in an array.
	Ideally, this method is called in your render loop.
.tilePos(x, y):
	Returns a boolean of whether or not that tile is active

*/

var Floor = {
    tiles: null,
    lastTiles: null,
    getTiles: () => {
    let floorTiles = []
    $.get('http://activefloor.bca.bergen.org:8080', data => {
    $(data).find('Row').each(function () {
    var $row, $vals
    $row = $(this);
    $vals = $row.attr('values')
    valArray = $vals.split(',')
    numArray = []
    for (let i in valArray) {
        numArray[i] = valArray[i] == '.' ? 0 : 1
    }
    floorTiles.push(numArray)
})
if (Floor.lastTiles == null) {
    Floor.lastTiles = floorTiles
    Floor.tiles = floorTiles
}
for (let row in floorTiles) {
    for (let col in floorTiles[row]) {
        let last = Floor.lastTiles[row][col]
        let cur = floorTiles[row][col]
        if (last == 0 && cur == 0) {
            Floor.tiles[row][col] = 0
        }
        else if (last == 0 && cur == 1) {
            Floor.tiles[row][col] = 1
        }
        else  if (last == 1 && cur == 1) {
            Floor.tiles[row][col] = 2
        }
        else if (last == 1 && cur == 0) {
            Floor.tiles[row][col] = 3
        }
    }
}
Floor.lastTiles = Floor.tiles
})
}
}
Floor.getTiles()

/* The Game object is probably the most important of all. Here is where all of the logic of your game is handled.
Recommended:

Use Game.init() to set all of your default variable values, and Game.reset() once the game is over.
Some functions you might want to include are Game.calculateScore(), Game.nextWave(),
Game.generateNumbers(), or Game.shootLaser() -- Whatever floats your point number.
A clock can be useful if you want to implement a timer or animation. An example is provided.

*/

var Game = {
    init: () => {
    // Music.init() (see music.js)
    Game.stage = 'main' // Set the starting stage of the game
Game.score = 0 // Example of a default variable value
Game.timestamp = 0
Game.color = 'white'
requestAnimationFrame(Render.update) // Make sure to start your render loop here!
},
toRad: (deg) => { return deg * Math.PI / 180 },
reset: () => {
    Game.stage = 'main'
    Game.score = 0
},
sampleClock: (timestamp) => {
    /* This is the best way to implement a clock for your game.
    Whether it is a spawn timer or animation clock, this will
    ensure the smoothest animations */

    /* First, we check if there is no timestamp value. If there is
    none, we set it equal to the current timestamp, which is the
    value in ms since the page loaded. We also set Game.clockRunning
    to true so that the clock can 'tick'. */
    if (Game.timestamp = 0) {
        Game.timestamp = timestamp
        Game.clockRunning = true
    }

    /* Here we check the time since this clock 'ticked'.
    'interval' is the length in ms of the delay between
    clock ticks. For example: if you are building a countdown timer,
    use 1000 as your interval to run the function every second. */
    let timeDifference = Game.timestamp - timestamp
    if (timeDifference >= interval) {
        Game.timestamp = timestamp // Update the timestamp to the current one
        // Your repeated code here
        // Set Game.clockRunning = false if you want to stop the clock
    }

    /* If we haven't stopped the clock, run the clock function again */
    if (Game.clockRunning) {
        requestAnimationFrame(Game.sampleClock)
    }

    /* Note: to initiate the clock, use requestAnimationFrame(Game.sampleClock)
    anywhere in your code (usually when the user starts playing the game)
    in order to set the initial timestamp properly */
}
}

/* Don't forget to start your engines! */
Game.init()
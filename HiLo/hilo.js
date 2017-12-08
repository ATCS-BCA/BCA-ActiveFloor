$(document).ready(function() {
    sendSemaphore(function() {
        // Clear spacing and borders.
        $("#canvas").addClass("app")

    })
    var Floor = {
        tiles: [],
        lastTiles: [],
        getTiles: () => {
        let floorTiles = []
        $.get('http://activefloor.bca.bergen.org:8080', data => {
        $(data).find('Row').each(function () {
        var $row, $vals, n
        $row = $(this);
        $vals = $row.attr('values')
        valArray = $vals.split(',')
        numArray = []
        for (let i in valArray) {
            numArray[i] = valArray[i] == '.' ? 0 : 1
        }
        floorTiles.push(numArray)
    })
    tiles = floorTiles
    if (lastTiles == []) { lastTiles = floorTiles }
    else { lastTiles == tiles }
    console.log(tiles)
})
},
    tileDown: (x, y) => {
        return Floor.lastTiles[x][y] == 0 && tiles[x][y] == 1
    },
    tileUp: (x, y) => {
        return Floor.lastTiles[x][y] == 1 && tiles[x][y] == 0
    },
    tilePos: (x, y) => {
        return tiles[x][y]
    },
    clickRegion: (x1, y1, x2, y2) => {
        for (let i=x1; i<x2; i++) {
            for (let j=y1; j<y2; j++) {
                if (Floor.tilePos(i,j)) return true
            }
        }
        return false
    }
}
    Floor.getTiles()

    /* Canvas constants */
    const canvas = document.getElementById('canvas')
    const $canvas = $('#canvas')
    const ctx = canvas.getContext('2d')
    const cw = canvas.width
    const ch = canvas.height

    /* Config */
    const FPS = 60
    const answerTime = 5.0 //seconds
    const numDisplayTime = 1.5 //seconds
    const defaultStroke = 'black'
    const defaultFill = 'black'

    /* Mouse Position => Tile Selection */
    var mx = 0
    var my = 0
    var tx = 0
    var ty = 0

    $canvas.mousemove(e => { //Updates coordinates when moving mouse over canvas
        let rect = canvas.getBoundingClientRect()
        mx = e.clientX - rect.left
        my = e.clientY - rect.top
        tx = Math.floor(mx/8)
        ty = Math.floor(my/8)
    })

    /* Defaults */
    ctx.strokeStyle = defaultStroke
    ctx.fillStyle = defaultFill

    /* [Params]
    x, y: canvas coordinates
    mx, my: mouse coordinates
    w, h: width/height
    sc: stroke color
    fc: fill color
    a1, a2: start/end angle
    cc: counterclockwise
    fill: boolean for fill/stroke
    */

    /* Event Handlers */
    function answerCheck() {
        clearInterval(Game.clock)
        let hi = Game.numArray[Game.index + 1] > Game.numArray[Game.index]
        let lo = !hi
        if (Floor.clickRegion(4,16,9,19)) {
            if (lo) {
                if (Game.numArray[Game.index + 2]) {
                    clearInterval(Game.answerClock)
                    Game.answer(Game.index + 1)
                    Game.clock = window.setInterval(Render.update, 1000/FPS)
                }
                else {
                    Game.score++
                    clearInterval(Game.answerClock)
                    Game.nextRound()
                }
            }
            else {
                Game.stage = 'wrong'
                Game.clock = window.setInterval(Render.update, 1000/FPS)
            }
        }
        else {
            if (Floor.clickRegion(14,16,19,19)) {
                if (hi) {
                    if (Game.numArray[Game.index + 2]) {
                        clearInterval(Game.answerClock)
                        Game.answer(Game.index + 1)
                        Game.clock = window.setInterval(Render.update, 1000/FPS)
                    }
                    else {
                        Game.score++
                        clearInterval(Game.answerClock)
                        Game.nextRound()
                    }
                }
                else {
                    Game.stage = 'wrong'
                    Game.clock = window.setInterval(Render.update, 1000/FPS)
                }
            }
        }
        //canvas.removeEventListener('mousedown', answerCheck)
    }
    function backCheck() {
        if (Floor.clickRegion(8,13,15,16)) {
            clearInterval(Game.clock)
            clearInterval(Game.answerClock)
            Game.init()
        }
        //canvas.removeEventListener('mousedown', backCheck)
    }
    function startCheck() {
        if (Floor.clickRegion(8,16,15,19)) {
            Render.clear()
            clearInterval(Game.clock)
            Game.stage = 'nums'
            Game.newGame()
        }
        //canvas.removeEventListener('mousedown', startCheck)
    }
    /* Each event listener corresponds to a button */
    //function click(type) {
    // 	canvas.addEventListener('mousedown', type)
    // }

    /* Basic drawing methods for canvas */
    var Draw = {
        arc: (x, y, r, a1, a2, cc) => {
        ctx.arc(x,y,r,a1,a2,cc)
},
    circle: (x, y, r, filled = true) => {
        ctx.arc(x,y,r,0,Math.PI*2)
        if (filled) ctx.fill()
        ctx.stroke()
    },
    colorFill: (fc) => { /* Fill color */
        ctx.fillStyle = fc
    },
    colorStroke: (sc) => { /* Stroke color */
        ctx.strokeStyle = sc
    },
    rect: (x, y, w, h, fill = true) => {
        fill ? ctx.fillRect(x,y,w,h) : ctx.strokeRect(x,y,w,h)
    },
    text: (x, y, text, font, h_align = 'center', v_align = 'middle', fill = true) => { /* Font: [bold | italic] font-size font-name */
        ctx.font = font
        ctx.textAlign = h_align
        ctx.baseLine = v_align
        fill ? ctx.fillText(text,x,y) : ctx.strokeText(text,x,y)
    }
}

    /* Collection of drawing methods to render components */
    var Render = {
        clear: (c = defaultFill) => {
        Draw.colorFill(c)
    Draw.rect(0,0,cw,ch)
},
    display: {
        game: () => {
            Draw.colorFill('white')
            Draw.text(cw/2,24,Game.time.toFixed(1),'16pt Arial')
            Render.display.number(Game.currentNumber)
            Render.display.score()
            Render.input.hiButton()
            Render.input.loButton()
        },
        number: (num) => {
            Draw.colorFill('white')
            Draw.text(cw/2,ch/2,num.toString(),'bold 28pt Arial')
        },
        mainMenu: () => {
            Draw.colorFill('white')
            Draw.text(cw/2,ch/3,'Hi-Lo','bold 20pt Arial')
            Draw.text(cw/2,ch/2 - 16,'a memory game','italic bold 8pt Arial')
            Render.input.startButton()
        },
        score: () => {
            Draw.colorFill('white')
            Draw.text(cw/2, ch-8, 'Score: ' + Game.score, '12pt Arial')
        },
        time: () => {
            Draw.colorStroke('white')
            Draw.colorFill('black')
            let bw = 120
            let bh = 96
            Draw.rect(cw/2-bw/2,ch/2-bh/2,bw,bh,false)
            Draw.colorFill('white')
            Draw.text(cw/2,ch/2.5,'Time\'s up!','bold 12pt Arial')
            Draw.text(cw/2,ch/2.5+20,'Score: ' + Game.score,'12pt Arial')
            Draw.colorFill('blue')
            Draw.rect(cw/2-32,ch/2+8,64,32)
            Draw.colorFill('white')
            Draw.text(cw/2,cw/2+30,'Back','bold 12pt Arial')
        },
        wrong: () => {
            Draw.colorStroke('white')
            Draw.colorFill('black')
            let bw = 120
            let bh = 96
            Draw.rect(cw/2-bw/2,ch/2-bh/2,bw,bh,false)
            Draw.colorFill('white')
            Draw.text(cw/2,ch/2.5,'Wrong answer!','bold 12pt Arial')
            Draw.text(cw/2,ch/2.5+20,'Score: ' + Game.score,'12pt Arial')
            Draw.colorFill('blue')
            Draw.rect(cw/2-32,ch/2+8,64,32)
            Draw.colorFill('white')
            Draw.text(cw/2,cw/2+30,'Back','bold 12pt Arial')
        }
    },
    input: {
        /* [Buttons]
        -Set dimensions of button
        -Fill a backround for button
        -Center text inside of button
        */
        hiButton: () => {
            let bx = 112
            let by = 128
            let bw = 48
            let bh = 32
            Draw.colorFill('orange')
            Draw.rect(bx,by,bw,bh)
            Draw.colorFill('white')
            Draw.text(bx+bw/2,by+bh/1.5,'Hi','bold 12pt Arial')
        },
        loButton: () => {
            let bx = 32
            let by = 128
            let bw = 48
            let bh = 32
            Draw.colorFill('purple')
            Draw.rect(bx,by,bw,bh)
            Draw.colorFill('white')
            Draw.text(bx+bw/2,by+bh/1.5,'Lo','bold 12pt Arial')
        },
        startButton: () => {
            let bx = 64
            let by = 128
            let bw = 64
            let bh = 32
            Draw.colorFill('blue')
            Draw.rect(bx,by,bw,bh)
            Draw.colorFill('white')
            Draw.text(bx+bw/2,by+bh/1.5,'Start','bold 12pt Arial')
        }
    },
    update: () => { /* Main rendering/logic method */
        Render.clear('black')
        Floor.getTiles()
        switch(Game.stage) {
            case 'main':
                Render.display.mainMenu()
                startCheck()
                break
            case 'answer':
                Render.display.game()
                answerCheck()
                break
            case 'time':
                Render.display.time()
                backCheck()
                break
            case 'wrong':
                Render.display.wrong()
                backCheck()
                break
        }
        /* Cursor for testing on PC */
        Draw.colorStroke('gray')
        Draw.rect(tx*8, ty*8, 8, 8, false)
        $('#mouseX').text(`MouseX: ${Math.round(mx*100)/100} Tile: ${tx}`)
        $('#mouseY').text(`MouseY: ${Math.round(my*100)/100} Tile: ${ty}`)
    }
}

    /* Game Controller */
    var Game = {
        answer: (n) => { /* Answer control */
        Game.time = answerTime
    Game.currentNumber = Game.numArray[n]
    Game.index = n
    Game.answerClock = setInterval(() => {
        if (Game.time >= 0.1) {
        Game.time -= 0.1
    }
else {
        clearInterval(Game.answerClock)
        Game.stage = 'time'
    }
}, 100)
},
    init: () => { /* Initialize the game */
        Game.score = 0
        Game.stage = 'main'
        Game.clock = setInterval(Render.update, 1000/FPS) /* Drawing clock */
    },
    inRect: (x1,x2,y1,y2) => { /* Check if input is in rectangle */
        return tx >= x1 && tx <= x2 && ty >= y1 && ty <= y2
    },
    newGame: () => { /* Start a new game */
        Game.numArray = []
        Game.newNumber() /* We cannot start with one number for the game, so we generate another here */
        Game.nextRound()
    },
    newNumber: () => {
        /* Make sure random numbers are not the same twice in a row */
        let num = Game.randInt(1,9)
        if (num != Game.numArray[Game.numArray.length - 1] ) { Game.numArray.push(num) }
        else { Game.newNumber() }
    },
    nextRound: () => { /* Generate a new number, show the sequence, then play Hi-Lo */
        Game.newNumber()
        Game.showSequence()
    },
    showSequence: () => { /* Show numbers for game at display speed */
        let n = 0
        Game.sequenceClock = setInterval(() => {
            if (n < Game.numArray.length) {
            Render.clear()
            Render.display.number(Game.numArray[n])
            Render.display.score()
            n++
        }
    else {
            Game.stage = 'answer'
            Game.answer(0)
            clearInterval(Game.sequenceClock)
            Game.clock = window.setInterval(Render.update, 1000/FPS)
        }
    }, numDisplayTime * 1000)
    },
    randInt: function getRandomIntInclusive(min, max) { /* Generate a random integer in the range */
        min = Math.ceil(min)
        max = Math.floor(max)
        return Math.floor(Math.random() * (max - min + 1)) + min
    }
}

    Game.init()

})
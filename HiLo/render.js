/* This is a sample Render object. It is in charge of displaying all elements shown on the screen.

[Methods]
.clear()
.mouseTiles()
.update()
=============
.clear():
	Clears the screen by drawing a full screen black rectangle.
	You can change the color of the clear, or alternatively,
	use the Draw.rectClear() method which removes all color
	from the canvas.
.mouseTiles():
	Only use this if working on a PC.
	This shows a gray box around the current tile your mouse is
	hovering over, which will help you define regions to react
	to the active floor. Additionally, it shows the value of
	the mouse and tile positions in pixels.
.update():
	The main render loop. Each time you update, the screen
	is cleared and all elements are redrawn. You should
	determine what elements need to be drawn based on
	other variables. One way to do this is through a 'stage'
	variable, which keeps track of the state of the game.
	For example, the 'main' stage can load start buttons,
	game titles, and more.
*/

var Render = {
	clear: () => {
		//Alternative: Draw.rectClear()
		Draw.rectFill(0,0,cw,ch,'black')
	},
	floorStatus: () => {
		for (let y in Floor.tiles) {
			for (let x in Floor.tiles[y]) {
				switch(Floor.tiles[x][y]) {
					case 0:
						Draw.rectFill(8*x, 8*y, 8, 8, 'blue')
						break
					case 1:
						Draw.rectFill(8*x, 8*y, 8, 8, 'orange')
						break
					case 2:
						Draw.rectFill(8*x, 8*y, 8, 8, 'green')
						break
					case 3:
						Draw.rectFill(8*x, 8*y, 8, 8, 'yellow')
						break
				}
			}
		}
	},
	mouseTiles: () => {
		/* Cursor for testing on PC */
		Draw.colorStroke('gray')
		Draw.rectStroke(tx*8, ty*8, 8, 8)
		$('#mouseX').text(`MouseX: ${Math.round(mx*100)/100} Tile: ${tx}`)
		$('#mouseY').text(`MouseY: ${Math.round(my*100)/100} Tile: ${ty}`)
	},
	rainbowCircles: () => {
		if (!Game.rainbow) {
			Game.rainbow = []
			for (let a = 0; a < 360; a += 3) {
				Game.rainbow.push(a)
			}
		}
		else {
			for (a in Game.rainbow) {
				let ang = Game.rainbow[a]
				let c = rainbowColor(ang/360 * 100)
				let x = (off) => {
					return Math.sin(Game.toRad((off - a) * (360/Game.rainbow.length)))
				}
				let y = (off) => {
					return Math.cos(Game.toRad((off - a) * (360/Game.rainbow.length)))
				}
				for (let z=0; z<29; z++) {
					Draw.circleFill(cw/2 + (88 - 3*z) * x(z), ch/2 + (88 - 3*z) * y(z), 2, c)
				}
			}
			let b = Game.rainbow.pop()
			Game.rainbow.splice(0,0,b)
		}
	},
	update: () => {
		Render.clear()
		Floor.getTiles() // see game.js
		switch(Game.stage) {
			case 'main':
				//Render.main()
				Render.floorStatus()
				//Render.rainbowCircles() // I know the rainbows are a bit extra. Feel free to uncomment Render.main() and comment this instead.
				break
			case 'play':
				//e.g. Render.ball(), Render.score(), etc.
				break
		}
		Render.mouseTiles()
		/* This keeps the game loop running at a smooth framerate */
		requestAnimationFrame(() => {
			Render.update()
		})
	},
	main: () => {
		/* Elements drawn for the 'main' stage */
		Draw.rectFill(cw/2 - 4, ch/2 - 4, 8, 8, Game.color)
	}
}

// Color algorithms
function HSVtoRGB (h, s, v) {
    var r, g, b, i, f, p, q, t
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h
    }
    i = Math.floor(h * 6)
    f = h * 6 - i
    p = v * (1 - s)
    q = v * (1 - f * s)
    t = v * (1 - (1 - f) * s)
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return {
        r: Math.round(r * 255),
        g: Math.round(g * 255),
        b: Math.round(b * 255)
    }
}
function rainbowColor (p) {
	var rgb = HSVtoRGB(p/100.0*0.85, 1.0, 1.0)
	return 'rgb('+rgb.r+','+rgb.g+','+rgb.b+')'
}
var Render = {
	clear: () => {
		//ctx.clearRect(0,0,cw,ch)
		Draw.colorFill('black')
		Draw.rectFill(0,0,cw,ch)
	},
	display: {
		health: () => {
			Draw.polygon(14, 4, false, HP_DARKGREEN, 114, 4, 104, 19, 4, 19, 14, 4)
			Draw.polygon(14, 4, false, HP_LIGHTGREEN, Game.health + 14, 4, Game.health + 4, 19, 4, 19, 14, 4)
			Draw.polygon(14, 4, {color: 'white', width: 1.5	}, false, 114, 4, 104, 19, 4, 19, 14, 4)
		},
		mainMenu: () => {
			Draw.linGrad(0, 0, cw, ch, {0: MAIN_PURPLE, 1: MAIN_BLUE})
			Draw.text(cw/2, ch/4, 'Dance Dance', '18pt Serpentine', 'white', 'black')
			Draw.text(cw/2, ch/4 + 12+6, 'Revolution', '18pt Serpentine', 'white', 'black')
			Draw.text(cw/2, ch*.75 + 6, 'PLAY', '14pt Serpentine', 'white')
		},
		results: () => {
			Draw.linGrad(0, 0, cw, ch, {0: RESULT_YELLOW, 1: RESULT_ORANGE})
			Draw.text(146, 16, 'Score', '10pt Serpentine', 'white') //Score
			Draw.text(150, 24, pad(Game.score, 7), '8pt Serpentine', 'white')
			Draw.text(44, 24, Game.failed ? 'FAIL!' : 'PASS!', '18pt Serpentine', 'white') //Pass / Fail
			Draw.text(4, 42, 'Marvelous:', '12pt Serpentine', MARVELOUS, false, 'left') //Hits
			Draw.text(140, 42, Game.stats.marvelousCount, '12pt Serpentine', MARVELOUS)
			Draw.text(4, 56, 'Perfect:', '12pt Serpentine', PERFECT, false, 'left')
			Draw.text(140, 56, Game.stats.perfectCount, '12pt Serpentine', PERFECT)
			Draw.text(4, 70, 'Great:', '12pt Serpentine', GREAT, false, 'left')
			Draw.text(140, 70, Game.stats.greatCount, '12pt Serpentine', GREAT)
			Draw.text(4, 84, 'Good:', '12pt Serpentine', GOOD, false, 'left')
			Draw.text(140, 84, Game.stats.goodCount, '12pt Serpentine', GOOD)
			Draw.text(4, 98, 'Almost:', '12pt Serpentine', ALMOST, false, 'left')
			Draw.text(140, 98, Game.stats.almostCount, '12pt Serpentine', ALMOST)
			Draw.text(4, 112, 'Missed:', '12pt Serpentine', MISS, false, 'left')
			Draw.text(140, 112, Game.stats.booCount, '12pt Serpentine', MISS)
			Draw.text(4, 126, 'Combo:', '12pt Serpentine', 'white', false, 'left') //Combo
			Draw.text(90, 126, Game.stats.maxCombo + '/' + Game.fullCombo, '12pt Serpentine', 'white', false, 'left')
			if (Game.stats.maxCombo == Game.fullCombo) {
				Draw.text(cw/2, 136, 'Full Combo!', '8pt Serpentine', 'white')
			}
			Draw.text(cw/2, 170, 'Continue', '14pt Serpentine', 'white')
		},
		score: () => {
			if (Game.lastHit != null) {
				switch(Game.lastHit) {
					case 'marvelous':
						Game.stats.marvelous.draw()
						break
					case 'perfect':
						Game.stats.perfect.draw()
						break
					case 'great':
						Game.stats.great.draw()
						break
					case 'good':
						Game.stats.good.draw()
						break
					case 'almost':
						Game.stats.almost.draw()
						break
					case 'boo':
						Game.stats.boo.draw()
						break
				}
			}
			if (Game.combo > 4) {
				Draw.text(156, 186, 'x' + Game.combo, '12pt Serpentine', 'white')
			}
			Draw.text(146, 12, 'Score', '10pt Serpentine', 'white')
			Draw.text(150, 20, pad(Game.score, 7), '8pt Serpentine', 'white')
		},
		songNotes: () => {
			let lastBeat = Math.floor((Game.notes.length-1)/Math.pow(2,3-Game.difficulty))*Math.pow(2,3-Game.difficulty)
			let lastNote = Game.notes[lastBeat][0]
			if (lastNote.hit == true && lastNote.active == false) {
				Game.stage = 'song-over'
			}
			for (let i in Game.notes) {
				for (let j in Game.notes[i]) {
					let note = Game.notes[i][j]
					if (note.y > 224) {
						if (!note.hit) {
							Game.noteHit(-1 * Game.difficulty, 0)
							note.hit = true
							Game.combo = 0
							Game.stats.booCount++
							Game.lastHit = 'boo'
							setTimeout(() => { Game.lastHit = null }, 300)
						}
						note.active = false
					}
					if (note.active) {
						note.draw()
						note.y += Game.difficulty + 1
					}
				}
			}
		}
	},
	input: {
		grayNotes: () => {
			for (let a in Game.arrows) {
				Game.arrows[a].draw()
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
	update: () => {
		Render.clear()
		switch(Game.stage) {
			case 'main-menu':
				Render.display.mainMenu()
				break
			case 'song':
				Render.input.grayNotes()
				Render.display.health()
				Render.display.score()
				Render.display.songNotes()
				break
			case 'song-over':
				Render.display.results()
				break
		}
		Render.mouseTiles()
		requestAnimationFrame(() => {
			Render.update()
		})
	}
}

/* Constructor for image objects (also a preloader) */
function Img(src, x, y, w, h, ang) {
	this.img = new Image()
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	this.ang = ang
	this.noScale = [x, y, w, h]
	this.img.src = src
	let self = this
	this.loaded = false
	this.img.onload = () => { self.loaded = true }
	this.draw = () => {
		if (this.loaded) {
			Draw.rotateImage(this.img, this.x + this.w/2, this.y + this.h/2, 1, this.ang, this.w, this.h)
		}
	}
}

/* Constructor for game notes */
function Arrow(pos) {
	this.img = new Image()
	this.x = 32 * pos
	this.y = -32
	this.w = 32
	this.h = 32
	this.img.src = 'arrow.png'
	this.active = false
	this.pos = pos
	let self = this
	this.loaded = false
	this.img.onload = () => { self.loaded = true }
	switch(pos) {
		case 0:
			this.ang = 90
			break
		case 1:
			this.ang = 0
			break
		case 2:
			this.ang = 180
			break
		case 3:
			this.ang = 270
			break
	}
	this.draw = () => {
		if (this.loaded) {
			Draw.rotateImage(this.img, this.x + this.w/2, this.y + this.h/2, 1, this.ang, this.w, this.h)
		}
	}
}
var Game = {
	hitTest: (pos) => {
		if (Game.stage == 'song') {
			Game.lastHit = null
			let noteArray = []
			for (i in Game.notes) {
				for (j in Game.notes[i]) {
					let curNote = Game.notes[i][j]
					if (curNote.pos == pos && curNote.hit == false && curNote.active == true) {
						noteArray.push(curNote)
					}
				}
			}
			let firstNote = noteArray[0]
			let delta = Math.abs(152 - firstNote.y)
			if (firstNote != undefined) {
				if (delta < 60) {
					if (delta <= 5) {
						Game.lastHit = 'marvelous'
						Game.noteHit(5, 1000 * (1 + Game.combo/100))
						Game.combo++
						Game.stats.marvelousCount++
					}
					if (delta > 5 && delta <= 10) {
						Game.lastHit = 'perfect'
						Game.noteHit(4, 500 * (1 + Game.combo/100))
						Game.combo++
						Game.stats.perfectCount++
					}
					if (delta > 10 && delta <= 15) {
						Game.lastHit = 'great'
						Game.noteHit(3, 250 * (1 + Game.combo/100))
						Game.combo++
						Game.stats.greatCount++
					}
					if (delta > 15 && delta <= 25) {
						Game.lastHit = 'good'
						Game.noteHit(1, 100 * (1 + Game.combo/100))
						Game.combo++
						Game.stats.goodCount++
					}
					if (delta > 25 && delta <= 45) {
						Game.lastHit = 'almost'
						Game.noteHit(0, 50 * (1 + Game.combo/100))
						Game.stats.almostCount++
					}
					if (delta > 45) {
						Game.lastHit = 'boo'
						Game.noteHit(-1 * Game.difficulty, 0)
						Game.combo = 0
						Game.stats.booCount++
					}
					firstNote.hit = true
					firstNote.active = false
					if (Game.combo > Game.stats.maxCombo) Game.stats.maxCombo = Game.combo
					setTimeout(() => { Game.lastHit = null }, 300)
				}
			}
		}
	},
	init: () => {
		Game.stage = 'main-menu'
		Game.difficulty = 1
		Render.update()
	},
	lastHit: null,
	noteHit: (health, score) => {
		Game.health += Math.min(health, 100 - Game.health)
		if (Game.health <= 0) {
			Game.playing = false
			Game.failed = true
			alert('fail')
			Game.stage = 'song-over'
		}
		Game.score += Math.floor(score)
	},
	notes: [],
	reset: () => {
		Game.health = 50
		Game.score = 0
		Game.stats.maxCombo = 0
		Game.stats.marvelousCount = 0
		Game.stats.perfectCount = 0
		Game.stats.greatCount = 0
		Game.stats.goodCount = 0
		Game.stats.almostCount = 0
		Game.stats.booCount = 0
		Game.playing = false
		Game.notes = []
	},
	stats: {
		maxCombo: 0,
		marvelousCount: 0,
		perfectCount: 0,
		greatCount: 0,
		goodCount: 0,
		almostCount: 0,
		booCount: 0,
		marvelous: '',
		perfect: '',
		great: '',
		good: '',
		almost: '',
		boo: ''
	},
	startSong: (i) => {
		if (!Game.playing) {
			Game.playing = true
			Game.song = Songs[i]
			Game.difficulty = 3
			Game.bpm = Game.song.bpm
			Game.beat = 0
			Game.playing = true
			Game.combo = 0
			Game.fullCombo = 0
			for (n in Game.song.notes) {
				if (n % Math.pow(2,3-Game.difficulty) == 0) {
					switch(Game.song.notes[n]) {
						case 1:
							Game.fullCombo++
							break
						case 2:
							Game.fullCombo++
							break
						case 3:
							Game.fullCombo+=2
							break
						case 4:
							Game.fullCombo++
							break
						case 5:
							Game.fullCombo+=2
							break
						case 6:
							Game.fullCombo+=2
							break
						case 8:
							Game.fullCombo++
							break
						case 9:
							Game.fullCombo+=2
							break
						case 10:
							Game.fullCombo+=2
							break
						case 12:
							Game.fullCombo+=2
							break
					}
				}
			}
			/* Load all note images */
			for (let n in Game.song.notes) {
				let note = Game.song.notes[n]
				switch(note) {
					case 12:
						Game.notes.push([new Arrow(0), new Arrow(1)])
						break
					case 10:
						Game.notes.push([new Arrow(0), new Arrow(2)])
						break
					case 9:
						Game.notes.push([new Arrow(0), new Arrow(3)])
						break
					case 8:
						Game.notes.push([new Arrow(0)])
						break
					case 6:
						Game.notes.push([new Arrow(1), new Arrow(2)])
						break
					case 5:
						Game.notes.push([new Arrow(1), new Arrow(3)])
						break
					case 4:
						Game.notes.push([new Arrow(1)])
						break
					case 3:
						Game.notes.push([new Arrow(2), new Arrow(3)])
						break
					case 2:
						Game.notes.push([new Arrow(2)])
						break
					case 1:
						Game.notes.push([new Arrow(3)])
						break
				}
			}

			/* Run the clock every one-eighth beat */
			Game.songClock = () => {
				if (Game.beat % (8 / Math.pow(2, Game.difficulty)) == 0) {
					if (Game.notes[Game.beat] == undefined) {
						Game.playing = false
					}
					for (n in Game.notes[Game.beat]) {
						Game.notes[Game.beat][n].active = true
						Game.notes[Game.beat][n].hit = false
					}
				}
				if (Game.beat % 4 == 0) {
					if (Game.health - Game.difficulty <= 0) {
						Game.health = 0
						Game.playing = false
						Game.stage = 'song-over'
					}
					Game.health -= Game.difficulty
				}
				Game.beat++
				if (Game.playing) {
					setTimeout(() => {
						requestAnimationFrame(Game.songClock)
					}, 60/Game.bpm/2*1000)
				}
			}
			Game.songClock()
		}
	},
	arrows: [],
	health: 50,
	playing: false,
	score: 0
}

/* Start engine */
Game.init()

/* Song data */
var Songs = []
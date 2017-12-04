/* Handle click events */
$canvas.click(e => {
switch(Game.stage) {
	case 'main-menu':
		if (inRect(8,17,15,18)) {
			Game.stage = 'song'
			Game.startSong(0)
			Game.arrows.push(new Img('arrow_gray.png', 0, 152, 32, 32, 90))
			Game.arrows.push(new Img('arrow_gray.png', 32, 152, 32, 32, 0))
			Game.arrows.push(new Img('arrow_gray.png', 64, 152, 32, 32, 180))
			Game.arrows.push(new Img('arrow_gray.png', 96, 152, 32, 32, -90))
			Game.stats.marvelous = new Img('scores/marvelous.png', 32, ch/3, 86, 14, 0)
			Game.stats.perfect = new Img('scores/perfect.png', 32, ch/3, 84, 14, 0)
			Game.stats.great = new Img('scores/great.png', 32, ch/3, 68, 14, 0)
			Game.stats.good = new Img('scores/good.png', 32, ch/3, 50, 14, 0)
			Game.stats.almost = new Img('scores/almost.png', 32, ch/3, 62, 14, 0)
			Game.stats.boo = new Img('scores/boo.png', 32, ch/3, 36, 14, 0)
		}
		break
	case 'song-over':
		if (inRect(5,19,18,21)) {
			Game.reset()
			Game.stage = 'main-menu'
		}
	}
})

/* Keycodes:
88: X
67: C
188: ,
190: .
*/
/* Handle keydown event */
$(document).keydown(e => {
	let key = e.keyCode
	switch(key) {
		case 88:
			scaleArrow(0,1)
			Game.hitTest(0)
			break
		case 67:
			scaleArrow(1,1)
			Game.hitTest(1)
			break
		case 188:
			scaleArrow(2,1)
			Game.hitTest(2)
			break
		case 190:
			scaleArrow(3,1)
			Game.hitTest(3)
			break
	}
})

/* Handle keyup event */
$(document).keyup(e => {
	let key = e.keyCode
	switch(key) {
		case 88:
			scaleArrow(0,-1)
			break
		case 67:
			scaleArrow(1,-1)
			break
		case 188:
			scaleArrow(2,-1)
			break
		case 190:
			scaleArrow(3,-1)
			break
	}
})

/* Check if mouse tile is in rectangular region */
function inRect(x1, y1, x2, y2) {
	return tx >= x1 && ty >= y1 && tx <= x2 && ty <= y2
}

/* Makes arrows bigger when keys are pressed */
function scaleArrow(arr, dir) {
	if (Game.stage == 'song') {
		let a = Game.arrows[arr]
		if (dir == 1) {
			if (a.y != a.noScale[1] - 3) {
				a.x -= 3
				a.y -= 3
				a.w += 6
				a.h += 6
			}
		}
		else {
			if (a.x != a.noScale[1]) {
				a.x += 3
				a.y += 3
				a.w -= 6
				a.h -= 6
			}
		}
	}
}

/* Adds leading zeroes to number */
function pad(n, width) {
	n = n + ''
	return n.length >= width ? n : new Array(width - n.length + 1).join('0') + n;
}
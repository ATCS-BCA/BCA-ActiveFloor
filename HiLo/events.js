var Event = {
	checkTile: (x, y) => {
		return Floor.tiles[x,y]
	}
}

/* This is a click handler used to detect click events on a computer */
$canvas.click(e => {
	/* Example start button click:
		if(inRect(x1,y1,x2,y2)) {
			Render.game()
			Game.started = true
		}
	*/
})

/* This is a keydown event handler */
$(document).keydown(e => {
	let key = e.keyCode
	switch(key) {
		/* Example:
			case 13: ('Enter' key)
				Game.stage = 'play'
				break
		*/
	}
})

/* This is a keyup event handler */
$(document).keyup(e => {
	let key = e.keyCode
	switch(key) {
		//Handle keyup
	}
})

/* Check if mouse tile is in rectangular region */
function inRect(x1, y1, x2, y2) {
	return tx >= x1 && ty >= y1 && tx <= x2 && ty <= y2
}
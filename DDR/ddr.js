const canvas = document.getElementById('canvas')
const $canvas = $('#canvas')
const ctx = canvas.getContext('2d')
const cw = canvas.width
const ch = canvas.height

/* Get mouse and tile position */
$canvas.mousemove(e => {
	let rect = canvas.getBoundingClientRect()
	mx = e.clientX - rect.left
	my = e.clientY - rect.top
	tx = Math.floor(mx/8)
	ty = Math.floor(my/8)
})

/* Global Presets */
const defaultStroke = 'black'
const defaultFill = 'black'
ctx.strokeStyle = defaultStroke
ctx.fillStyle = defaultFill
const MAIN_BLUE = '#86C5DA'
const MAIN_PURPLE = '#C3AED6'
const RESULT_YELLOW = '#FFFF66'
const RESULT_ORANGE = '#FFC04D'
const MARVELOUS = '#C6C7AC'
const PERFECT = '#DDD73B'
const GREAT = '#3E9623'
const GOOD = '#5697CA'
const ALMOST = '#B44E8D'
const MISS = '#CE544D'
const HP_DARKGREEN = '#003100'
const HP_LIGHTGREEN = '#007E00'

/* Mouse Position => Tile Selection */
var mx = 0
var my = 0
var tx = 0
var ty = 0
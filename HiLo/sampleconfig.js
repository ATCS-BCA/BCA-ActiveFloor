/* This is usually the first file that I load.
It allows me to define the canvas and set global variables to be used in other .js files,
such as colors or test values. */

/* Define the canvas object for drawing, and store canvas width and height */
const canvas = document.getElementById('canvas')
const $canvas = $('#canvas') // Make sure your canvas element ID matches this one!
const ctx = canvas.getContext('2d')
const cw = canvas.width
const ch = canvas.height

/* Get mouse and tile position for computer testing */
$canvas.mousemove(e => {
	let rect = canvas.getBoundingClientRect()
	mx = e.clientX - rect.left
	my = e.clientY - rect.top
	tx = Math.floor(mx/8)
	ty = Math.floor(my/8)
})

/* Mouse position and tile position */
var mx = 0
var my = 0
var tx = 0
var ty = 0
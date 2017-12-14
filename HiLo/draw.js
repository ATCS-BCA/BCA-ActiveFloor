/* This is a drawing library I wrote to make it easier to interact with the canvas.
[Methods]
.arc(x, y, r, a1, a2, cc, color)
.circleStroke(x, y, r, color)
.circleFill(x, y, r, color)
.colorFill(color)
.colorStroke(color)
.fill()
.image(img, x, y, w, h)
.linGrad(x, y, w, h, stops)
.polygon(x1, y1, border = { color: 'black', width: 1, lineJoin: 'round', lineCap: 'square'}, fillColor = false, ...coords)
.rectStroke(x, y, w, h, color)
.rectFill(x, y, w, h, color)
.rectClear()
.rotateImage(img, x, y, scale, ang, w, h)
.stroke()
.text(x, y, text, font, fillColor, borderColor = false, h_align = 'center', v_align = 'middle')
=============
In general, a stroke outlines a shape while a fill is a solid shape
If a method has more specific parameters, they are explained in the
sample object below. These are some common parameters:

x, y: x/y starting positions
r: radius
w, h: width/height
color: Hex, rgba(), decimal, etc. color value
ang: angle in degrees

*/

var Draw = {
	arc: (x, y, r, a1, a2, cc, color = false) => { /* Arc curve */
		/* a1, a2 are starting and ending angles
		cc is a boolean for whether or not to go counterclockwise */
		if (color) Draw.colorStroke(color)
		ctx.arc(x,y,r,a1,a2,cc)
		ctx.stroke()
	},
	circleStroke: (x, y, r, color = false) => { /* Circle border */
		if (color) Draw.colorStroke(color)
		ctx.beginPath()
		ctx.arc(x,y,r,0,Math.PI*2)
		ctx.closePath()
		ctx.stroke()
	},
	circleFill: (x, y, r, color = false) => { /* Filled circle */
		if (color) Draw.colorFill(color)
		ctx.beginPath()
		ctx.arc(x,y,r,0,Math.PI*2)
		ctx.closePath()
		ctx.fill()
	},
	colorFill: (fc) => { /* Fill color */
		ctx.fillStyle = fc
	},
	colorStroke: (sc) => { /* Stroke color */
		ctx.strokeStyle = sc
	},
	fill: () => { /* Simple canvas fill */
		ctx.fill()
	},
	image: (img, x, y, w, h) => { /* Draws a preloaded image */
		/* img is the Image() object */
		ctx.drawImage(img, x, y, w, h)
	},
	linGrad: (x, y, w, h, stops) => { /* Rectangle with gradient */
		/* Stops is an object where the key is the decimal percent of the width
		and the value is the color to use at that point */
		let lg = ctx.createLinearGradient(x,y,x+w,y+h)
		for (var stop in stops) {
			lg.addColorStop(stop, stops[stop])
		}
		Draw.colorFill(lg)
		Draw.rectFill(x,y,w,h)
	},
	polygon: (x1, y1, border = { color: 'black', width: 1, lineJoin: 'round', lineCap: 'square'}, fillColor = false, ...coords) => {
		/* Draws a polygon given a series of coordinates */
		/* Border is an object with color, width, lineJoin, and lineCap properties
		coords is a sequence of (x, y) coordinates [e.g.: (1, 2, 5, 6) => (1, 2) and (5, 6)] */
		let c = coords
		ctx.moveTo(x1, y1)
		if (border) { ctx.strokeStyle = border.color }
		ctx.beginPath()
		for (let i=0; i<c.length - 1; i+=2) {
			ctx.lineTo(c[i],c[i+1])
		}
		ctx.closePath()
		if (fillColor) {
			ctx.fillStyle = fillColor
			ctx.fill()
		}
		if (border) { 
			ctx.lineWidth = border.width
			ctx.lineCap = border.lineCap
			ctx.lineJoin = border.lineJoin
			ctx.stroke()
		}
		ctx.lineWidth = 1
		ctx.moveTo(0, 0)
	},
	rectStroke: (x, y, w, h, color = false) => { /* Border of rectangle */
		if (color) Draw.colorStroke(color)
		ctx.strokeRect(x,y,w,h)
	},
	rectFill: (x, y, w, h, color = false) => { /* Solid rectangle */
		if (color) Draw.colorFill(color)
		ctx.fillRect(x,y,w,h)
	},
	rectClear: () => { /* Clears the screen */
		ctx.clearRect(0,0,cw,ch)
	},
	rotateImage: (img, x, y, scale, ang, w, h) => { /* Rotates an image 'ang' degrees counterclockwise */
		/* Scale is always 1 unless you manually rescaled the image */
		ctx.setTransform(scale, 0, 0, scale, x, y)
		ctx.rotate(ang*Math.PI/180)
		Draw.image(img, -w/2, -h/2, w, h)
		ctx.setTransform(1,0,0,1,0,0)
	},
	stroke: () => { /* Simple canvas stroke */
		ctx.stroke()
	},
	text: (x, y, text, font, fillColor, borderColor = false, h_align = 'center', v_align = 'middle') => {
		/* Creates text with specified parameters */
		/* Text is the string value you want displayed 
		h_align and v_align are horizontal and vertical alignments
		Font format: [bold | italic] font-size font-name */
		ctx.beginPath()
		ctx.font = font
		ctx.textAlign = h_align
		ctx.baseLine = v_align
		ctx.fillStyle = fillColor
		ctx.fillText(text,x,y)
		ctx.fill()
		if (borderColor) { 
			ctx.strokeStyle = borderColor
			ctx.strokeText(text,x,y)
			ctx.stroke()
		}
		ctx.closePath()
	}
}

/* This is an image constructor. It handles loading and drawing images.
You should always preload all of your images before running the render loop,
since caching the images improves performance. Try storing your image objects
in arrays [e.g.: Game.enemies.push(new Img(...params)) ]

src: The pathfile of your image (or URL)
x, y: Position of the image (top-left corner)
w, h: Width/height of the image (image will scale to this size)
ang: Angle to rotate the image (90 = 90 degrees counterclockwise)
.draw():
	Draws the image to the canvas if it has loaded

*/
function Img(src, x, y, w, h, ang) {
	this.img = new Image()
	this.x = x
	this.y = y
	this.w = w
	this.h = h
	this.ang = ang
	this.img.src = src
	let self = this
	this.loaded = false
	this.img.onload = () => { self.loaded = true }
	this.draw = () => {
		if (this.loaded) {
			if (this.ang == 0) {
				Draw.image(this.img, this.x, this.y, this.w, this.h)
			}
			else {
				Draw.rotateImage(this.img, this.x + this.w/2, this.y + this.h/2, 1, this.ang, this.w, this.h)
			}
		}
	}
}
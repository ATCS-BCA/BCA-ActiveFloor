/* Basic drawing methods for canvas */
	var Draw = {
		arc: (x, y, r, a1, a2, cc) => { /* Arc curve */
			ctx.arc(x,y,r,a1,a2,cc)
		},
		circleStroke: (x, y, r, filled = true) => { /* Circle border */
			ctx.arc(x,y,r,0,Math.PI*2)
			ctx.stroke()
		},
		circleFill: (x, y, r, filled = true) => { /* Filled circle */
			ctx.arc(x,y,r,0,Math.PI*2)
			ctx.fill()
			ctx.stroke()
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
			ctx.drawImage(img, x, y, w, h)
		},
		linGrad: (x, y, w, h, stops) => { /* Rectangle with gradient */
			let lg = ctx.createLinearGradient(x,y,x+w,y+h)
			for (var stop in stops) {
				lg.addColorStop(stop, stops[stop])
			}
			Draw.colorFill(lg)
			Draw.rectFill(x,y,w,h)
		},
		polygon: (x1, y1, border = { color: 'black', width: 1, lineJoin: 'round', lineCap: 'square'}, fillColor = false, ...coords) => {
			/* Draws a polygon given an array of coordinates */
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
			ctx.moveTo(0, 0)
		},
		rectStroke: (x, y, w, h) => { /* Rectangle border */
			ctx.strokeRect(x,y,w,h)
		},
		rectFill: (x, y, w, h) => { /* Filled rectangle */
			ctx.fillRect(x,y,w,h)
		},
		rotateImage: (img, x, y, scale, ang, w, h) => { /* Rotates and draws an image */
			/* x, y is the center of the image */
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
			/* Font: [bold | italic] font-size font-name */
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
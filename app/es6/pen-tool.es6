'use strict'

import { Tool } from './tool.es6'
import { Project } from './project.es6'
import { Controller } from './controller.es6'
import { config } from './config.es6'

import { historyButton } from './history-button.es6'
import { Autosave } from './autosave.es6'

let page, pageX, pageY, moved
let sizeTable = [ 2, 4, 8 ]

let points, stopped;


class PenTool extends Tool {
  constructor() {
    super()
    this.name = 'pen'
  }

  onDown(e, pid) {
    const project = Project.current
    page = project.findPage(pid)
    if (!page) return
  
    const raw = Controller.rawPositionFromEvent(e)
    points = [raw]

    const pos = page.positionFromRaw(raw)
    pageX = pos[0]
    pageY = pos[1]
    moved = false
    
    const d = sizeTable[this.getPenSize() % 3]
    project.scratch.attach(page)
    project.scratch.initBound(pageX, pageY, Math.ceil((d + 1) / 2))

    return true
  }

  onUp(e) {
    if (!page) return
    const project = Project.current

    if (moved) {
//    project.scratch.draw()
      this.draw()
    }
    project.scratch.detach()
  }

  onMove(e) {
    if (!page) return

    const project = Project.current

    let pressure = Math.min(1, e.pressure * e.pressure * 2)
    if (!this.getPenPressure()) pressure = 0.7

    const raw = Controller.rawPositionFromEvent(e)
    raw[2] = pressure
    points.push(raw)
    
    const pos = page.positionFromRaw(raw)
    const x = pos[0]
    const y = pos[1]

    if (pageX != x || pageY != y) {
      moved = true

      const ctx = project.scratch.ctx
      this.drawSegment(ctx, pageX, pageY, pressure, x, y, pressure)
      pageX = x
      pageY = y

      const d = sizeTable[this.getPenSize() % 3]
      project.scratch.updateBound(x, y, Math.ceil((d + 1) / 2))
    }
  }

  drawSegment(ctx, x0, y0, pressure0, x1, y1, pressure1, color) {
    if (!ctx) return
    const d = sizeTable[this.getPenSize() % 3]
    const lineWidth = (d - 2) + (2 * pressure0) + 0.5

    ctx.beginPath()
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'butt' //'round'
    ctx.strokeStyle = `rgba(0, 0, 0, ${pressure0})`
    //if (color) ctx.strokeStyle = `rgba(255, 0, 0, ${pressure0})`
    
    ctx.moveTo(x0, y0)
    ctx.lineTo(x1, y1)
    ctx.stroke()
  }

  draw() {
    const rect = Project.current.scratch.rect()
    page.pushUndo({
      type: 'canvas',
      pid: page.pid,
      x: rect[0],
      y: rect[1],
      width: rect[2],
      height: rect[3]
    })
    historyButton.update()

    //ストロークの描画
    const ctx = page.ctx
    const length = points.length
    if (!ctx || length < 2) return

    //ストロークの補間
    points[0][2] = points[1][2]
    this.removeJaggy(0)
    this.removeJaggy(1)
    
    const raw = points.unshift()
    const pos = page.positionFromRaw(raw)
    pageX = pos[0]
    pageY = pos[1]
      
    for (const raw of points) {
      const pos = page.positionFromRaw(raw)
      const x = pos[0]
      const y = pos[1]
      const pressure = raw[2]

      if (pageX != x || pageY != y) {
	this.drawSegment(ctx, pageX, pageY, pressure, x, y, pressure, 1)
	pageX = x
	pageY = y
      }
    }
    Autosave.pushPage(page)
  }

  removeJaggy(component) {
    const numPoints = points.length

    const tmp = []
    for (const point of points) tmp.push(point[component])
    
    let x = points[0][component]
    let index = 1
    let len = 1
    while (index < numPoints) {
      if (points[index][component] == x) {
	index++
	len++
	
      } else {
	if (points[index][component] < x) {
	  for (let j = 0; j < len - 1; j++) {
	    const k = (j + 1) / len
	    points[index - (len - 1) + j][component] -= k
	  }
	  
	} else {
	  for (let j = 0; j < len - 1; j++) {
	    const k = (j + 1) / len
	    points[index - (len - 1) + j][component] += k
	  }
	}
	x = points[index][component]
	len = 0
      }
    }

    const tmp2 = []
    for (const point of points) tmp2.push(point[component])
    console.log('removeJaggy', component, tmp)
    console.log('removeJaggy', component, tmp2)
  }
  
  getPenPressure() {
    return config.getValue('penPressure', true)
  }

  getPenSize() {
    return config.getValue('penSize', 0)
  }
}


export { PenTool }

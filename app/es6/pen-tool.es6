'use strict'

import { Tool } from './tool.es6'
import { Project } from './project.es6'
import { config } from './config.es6'

let page, pageX, pageY, moved
let sizeTable = [ 2, 4, 8 ]


class PenTool extends Tool {
  constructor() {
    super()
    this.name = 'pen'
    //this.size = config.getValue('penSize', 0)
    //this.pressure = config.getValue('penPressure', true)
  }

  onDown(e, pid) {
    const project = Project.current
    page = project.findPage(pid)
    if (!page) return
  
    const pos = page.positionFromEvent(e)
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
    if (moved) project.scratch.draw()
    project.scratch.detach()
  }

  onMove(e) {
    if (!page) return

    const project = Project.current
    const pos = page.positionFromEvent(e)
    const x = pos[0]
    const y = pos[1]
    
    let pressure = Math.min(1, e.pressure * e.pressure * 2)
    if (!this.getPenPressure()) pressure = 1


    if (pageX != x || pageY != y) {
      moved = true

      const d = sizeTable[this.getPenSize() % 3]
      const ctx = project.scratch.ctx
      if (ctx) {
	ctx.beginPath()
	ctx.lineWidth = d * pressure + 0.5
	ctx.lineCap = 'butt' //'round'
	ctx.strokeStyle = `rgba(0, 0, 0, ${pressure * 1})`
	ctx.moveTo(pageX, pageY)
	ctx.lineTo(x, y)
	ctx.stroke()
      }
      pageX = x
      pageY = y

      project.scratch.updateBound(x, y, Math.ceil((d + 1) / 2))
    }
  }

  getPenPressure() {
    return config.getValue('penPressure', true)
  }

  getPenSize() {
    return config.getValue('penSize', 0)
  }
}


export { PenTool }

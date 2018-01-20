'use strict'

import { Tool } from './tool.es6'
import { Project } from './project.es6'
import { Controller } from './controller.es6'

let page, pageX, pageY, moved


class EraserTool extends Tool {
  constructor() {
    super()
    this.name = 'eraser'
  }

  onDown(e, pid) {
    const project = Project.current
    page = project.findPage(pid)
    if (!page) return
  
    const pos = page.positionFromEvent(e)
    pageX = pos[0]
    pageY = pos[1]
    moved = false

    const d = this.getEraserSize()
    project.scratch.attach(page)
    project.scratch.initBound(pageX, pageY, Math.ceil((d + 1) / 2))
    return true
  }

  onUp(e) {
    if (!page) return

    const project = Project.current
    if (moved) project.scratch.erase()
    project.scratch.detach()
  }

  onMove(e) {
    if (!page) return

    const project = Project.current
    const pos = page.positionFromEvent(e)
    const x = pos[0]
    const y = pos[1]

    let pressure= Controller.pressure
    pressure = Math.min(1, pressure * pressure * 2)
    if (!this.getEraserPressure()) pressure = 0.7
    
    if (pageX != x || pageY != y) {
      moved = true

      const d = this.getEraserSize()
      const ctx = project.scratch.ctx
      if (ctx) {
	ctx.beginPath()
	ctx.lineWidth = (d - 2) + (2 * pressure) + 0.5
	ctx.lineCap = 'round'
	ctx.strokeStyle = `rgba(255, 255, 255, ${pressure})` //rgba(0, 255,...

	ctx.moveTo(pageX, pageY)
	ctx.lineTo(x, y)
	ctx.stroke()
      }
      pageX = x
      pageY = y

      project.scratch.updateBound(x, y, Math.ceil((d + 1) / 2))
    }
  }

}


export { EraserTool }


'use strict'

import { Tool } from './tool.es6'
import { Project } from './project.es6'
import { Controller } from './controller.es6'
import { config } from './config.es6'

import { historyButton } from './history-button.es6'
import { Autosave } from './autosave.es6'

let page, pageX, pageY
let points

class LineTool extends Tool {
  constructor() {
    super()
    this.name = 'line'
  }

  onDown(e, pid) {
    nn.log('line onDown')
    const project = Project.current
    page = project.findPage(pid)
    if (!page) return

    const raw = points[0]
    const pos = page.positionFromRaw(raw)
    pageX = pos[0]
    pageY = pos[1]

    project.scratch.attach(page)
    project.scratch.initBound(pageX, pageY, 10)
  }

  onUp(e) {
    nn.log('line onUp')
    const project = Project.current
    const rect = project.scratch.rect()
    
    page.pushUndo({
      type: 'canvas',
      pid: page.pid,
      x: rect[0],
      y: rect[1],
      width: rect[2],
      height: rect[3],
    })
    historyButton.update()

    const ctx = page.ctx
    this.drawLine(ctx, e)
    Autosave.pushPage(page)
    
    project.scratch.detach()
    Tool.pop()
  }

  onMove(e) {
    nn.log('line onMove')
    const project = Project.current
    const ctx = project.scratch.ctx
    this.drawLine(ctx, e)
  }

  drawLine(ctx, e) {
    const project = Project.current
    project.scratch.clearBound()

    const pos0 = page.positionFromRaw(points[0])
    const pos = page.positionFromEvent(e)
    const x0 = pos0[0]
    const y0 = pos0[1]

    let x1 = pos[0]
    let y1 = pos[1]
    if (Controller.shiftKey) {
      const dx = x1 - x0
      const dy = y1 - y0
      const r = Math.sqrt(dx * dx + dy * dy)
      const deg = Math.atan2(dx, dy) * 12.0 / Math.PI
      const radian = Math.round(deg) * Math.PI / 12.0
      x1 = r * Math.sin(radian) + x0
      y1 = r * Math.cos(radian) + y0
    }
    
    const pressure = points[points.length - 1][2] || 0.7
    this.drawSegment(ctx, x0, y0, pressure, x1, y1, pressure)

    const maxWidth = 10
    project.scratch.initBound(x0, y0, maxWidth)
    project.scratch.updateBound(x1, y1, maxWidth)
  }

  setPoints(src) {
    points = src
  }
}


export { LineTool }

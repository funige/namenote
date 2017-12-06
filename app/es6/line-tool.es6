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
    const ctx = page.ctx
    this.drawLine(ctx, e)

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
    const x1 = pos[0]
    const y1 = pos[1]
    const pressure = 0.7
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

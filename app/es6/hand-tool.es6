'use strict'

import { Tool } from './tool.es6'
import { Project } from './project.es6'
import { View } from './view.es6'
import { Animation } from './animation.es6'
import { Controller } from './controller.es6'

let page, pageX, pageY, dragged
let x0, y0, t0
let vx, vy

class HandTool extends Tool {
  constructor() {
    super()
    this.name = 'hand'
  }

  onDown(e, pid) {
    x0 = Controller.x
    y0 = Controller.y
    t0 = Date.now()
    vx = 0
    vy = 0

    //nn.log('hand onDown', Controller.x, Controller.y, Date.now())
    Animation.cancel()
  }

  onUp(e) {
    //nn.log('hand onUp', Controller.x, Controller.y, Date.now())

    const v = Math.sqrt(vx * vx + vy * vy)
    if (v > 0) {
      if (Math.abs(vx) > Math.abs(vy)) {
	if (Math.abs(vy / vx) < 0.2) vy = 0
      } else {
	if (Math.abs(vx / vy) < 0.2) vx = 0
      }
      nn.log('speed', vx, vy, v)
      if (v > 500) {
	Animation.setScroll(vx, vy)
      }
    }
    Tool.pop()
  }

  onMove(e) {
    //nn.log('hand onMove', Controller.x, Controller.y, Date.now())

    const target = $('.root')[0].parentNode
    const now = Date.now()
    
    const dx = Controller.x - x0
    const dy = Controller.y - y0
    const dt = (now - t0) / 1000.0
	  
    //速度の計算
    if (dt > 0) {
      vx = vx * 0.2 + (dx / dt) * 0.8
      vy = vy * 0.2 + (dy / dt) * 0.8
    }
    
    target.scrollLeft -= dx
    target.scrollTop -= dy

    x0 = Controller.x
    y0 = Controller.y
    t0 = now
  }
}


export { HandTool }


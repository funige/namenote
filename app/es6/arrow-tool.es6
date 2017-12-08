'use strict'

import { Tool } from './tool.es6'
import { Project } from './project.es6'
import { View } from './view.es6'
import { command } from './command.es6'
import { historyButton } from './history-button.es6'
import { config } from './config.es6'

let page, pageX, pageY, moved
let d = 1


class ArrowTool extends Tool {
  constructor() {
    super()
    this.name = 'arrow'
  }

  start() {
    Tool.prototype.start.call(this)
    this.skip = (Tool.prevName == 'text') ? true : false
  }
  
  onDown(e, pid) {
    nn.log('arrow onDown')
    const project = Project.current
    if (!project) return

    project.selectPage(pid)
    page = project.findPage(pid)
    if (!page) return

    if (project.selection.lifted) {
      nn.log('lifted')
      project.selection.clear()
      return
    }
    
    const pos = page.positionFromEvent(e)
    pageX = pos[0]
    pageY = pos[1]
    moved = false

    project.scratch.attach(page)
    project.scratch.initBound(pageX, pageY, 1)
  }

  onUp(e) {
    if (!page) return
    nn.log('arrow onUp')
    
    const project = Project.current
    if (!project) return

    if (!moved) {
      if (!this.skip) {
	this.skip = true
	project.selection.clear()
	
	page.pushUndo({ type:'text', pid:page.pid }) // pushUndo
	
	page.addText(pageX, pageY, null, (node) => {
	  project.selection.add(node)
	  command.toggleEditMode()
	})
      } else {
	this.skip = false
      }
    }

    project.scratch.detach()

    if (Tool.stack.length > 1) {
      Tool.pop()
    }
  }

  onMove(e) {
    if (!page) return
    nn.log('arrow onMove')
    
    const project = Project.current
    if (!project) return
    if (!page) return

    const pos = page.positionFromEvent(e)
    const x = pos[0]
    const y = pos[1]
    const minMove = 5 / View.scale() // 5

    if (Math.abs(pageX - x) >= minMove || Math.abs(pageY - y) >= minMove) {
      moved = true
    }
    
    if (pageX != x || pageY != y) {
      // バウンディングボックスの描画
      pageX = x
      pageY = y
      project.scratch.updateBound(x, y, d)
    }
  }
}


export { ArrowTool }

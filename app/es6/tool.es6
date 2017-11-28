'use strict'

import { toolButton } from './tool-button.es6'


class Tool {
  constructor() {
    this.name = 'dummy'
  }

  onDown(e, text) {
  }

  onUp(e) {
  }

  onMove(e) {
  }

  start() {
    nn.log('start', this.name)
    toolButton.update(this.name)
  }
  
  stop() {
    nn.log('stop', this.name)
    Tool.prevName = this.name
  }
}

Tool.init = () => {
  Tool.stack = [Tool.tools['pen']]
}

Tool.select = (name) => {
  const next = Tool.tools[name]
  if (next) {
    if (Tool.current) {
      Tool.current.stop()
    }
    Tool.current = next
    Tool.current.start()

    Tool.hideOtherDropdown(name)
  }
}

Tool.push = (name) => {
  const next = Tool.tools[name]
  if (next) {
    Tool.current.stop()
    Tool.stack.push(Tool.current);
    Tool.current = next
    next.start()
  }
}

Tool.pop = () => {
  if (Tool.current) {
    Tool.current.stop()
  }
  Tool.current = Tool.stack.pop();
  Tool.current.start()
  
}

Tool.setSkip = (value) => {
  const arrowTool = Tool.tools['arrow']
  if (arrowTool) arrowTool.skip = value
}

Tool.isSelected = (name) => {
  if (Tool.current) {
    if (Tool.current.name == name) return true;
  }
  return false
}

Tool.toggleDropdown = (e, name) => {
  if ($(e.target).hasClass('img-button')) {
    const id = name + '-dropdown'
    for (const element of $('.dropdown-content')) {
      if (element.id == id) {
	element.style.display = (element.style.display != 'block') ? 'block' : 'none'
      } else {
	element.style.display = 'none'
      }
    }
  }
}

Tool.hideOtherDropdown = (name) => {
  const id = name + '-dropdown'
  for (const element of $('.dropdown-content')) {
    if (element.id != id) {
      element.style.display = 'none'
    }
  }
}

Tool.tools = {}
Tool.current = null

Tool.stack = []
Tool.dragTarget = null
Tool.dragPID = 0


export { Tool }

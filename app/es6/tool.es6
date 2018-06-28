'use strict'

import { toolButton } from './tool-button.es6'
import { config } from './config.es6'


function hideDropdown(element) {
  const name = element.id.replace(/-dropdown$/, '')
  element.style.display = 'none'

  if (name == 'menu' || name == 'file') {
    $('#' + name + '-button').imgButton('locked', false)
  }
}

function showDropdown(element) {
  const name = element.id.replace(/-dropdown$/, '')
  element.style.display = 'block'

  if (name == 'menu' || name == 'file') {
    $('#' + name + '-button').imgButton('locked', true)
  }
}

////////////////////////////////////////////////////////////////

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

  drawSegment(ctx, x0, y0, pressure0, x1, y1, pressure1) { //, color) {
    if (!ctx) return
    const d = this.getPenSize()
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

  getPenPressure() {
    return config.getValue('penPressure', true)
  }

  getPenSize() {
    const penSize = config.getValue('penSize', 0)
    const sizeTable = [ 2, 4, 8]
    return sizeTable[penSize % 3]
  }

  getEraserPressure() {
    return config.getValue('eraserPressure', true)
  }

  getEraserSize() {
    const eraserSize = config.getValue('eraserSize', 0)
    const sizeTable = [ 10, 25, 100 ]
    return sizeTable[eraserSize % 3]
  }
  
}

////////////////////////////////////////////////////////////////

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
  if (e && !$(e.target).hasClass('img-button')) return

  const id = name + '-dropdown'
  
  for (const element of $('.dropdown-content')) {
    if (element.id == id && element.style.display != 'block') {
      showDropdown(element)

    } else {
      hideDropdown(element)
    }
  }
}

Tool.showDropdown = (name) => {
  const id = name + '-dropdown'
  for (const element of $('.dropdown-content')) {
    if (element.id == id) {
      showDropdown(element)

    } else {
      hideDropdown(element)
    }
  }
}

Tool.hideDropdown = () => {
  for (const element of $('.dropdown-content')) {
    hideDropdown(element)
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

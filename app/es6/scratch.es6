'use strict'

import { historyButton } from './history-button.es6'
import { Autosave } from './autosave.es6'


class Scratch {
  constructor(project) {
    this.project = project
    this.page = null
    
    this.canvas = document.createElement('canvas')
    //this.canvas.imageSmoothingEnabled = false
    this.canvas.className = 'scratch'
    this.canvas.width = project.pageSize[0]
    this.canvas.height = project.pageSize[1]
    this.ctx = this.canvas.getContext('2d')
  }

  destructor() {
    this.project = null
  }

  attach(page) {
    this.page = page
    this.page.root.insertBefore(this.canvas, this.page.canvas.nextSibling)
  }

  detach() {
    if (this.page) {
      this.clearBound()
      this.page = null
    }
  }

  draw() {
    if (this.page) {
      const rect = this.rect()
      this.page.pushUndo({
	type: 'canvas',
	pid: this.page.pid,
	x: rect[0],
	y: rect[1],
	width: rect[2],
	height: rect[3]
      })
      historyButton.update()

      this.page.ctx.drawImage(this.canvas, ...rect, ...rect)

      const result = Autosave.pushPage(this.page)
    }
  }

  erase() {
    if (this.page) {
      const rect = this.rect()
      this.page.pushUndo({
	type: 'canvas',
	pid: this.page.pid,
	x: rect[0],
	y: rect[1],
	width: rect[2],
	height: rect[3]
      })
      historyButton.update()

      const srcData = this.ctx.getImageData(...rect)
      const src8 = new Uint8ClampedArray(srcData.data.buffer)
      const dstData = this.page.ctx.getImageData(...rect)
      const dst8 = new Uint8ClampedArray(dstData.data.buffer)

      let index = 0
      for (let j = 0; j < rect[3]; j++) {
	for (let i = 0; i < rect[2]; i++) {
	  const a0 = dst8[index + 3] / 255.0
	  const a1 = src8[index + 3] / 255.0
	  const c0 = dst8[index + 0] / 255.0
	  const c1 = src8[index + 0] / 255.0
	  //const a = a0 + a1 - a0 * a1
	  //dst8[index + 3] -= Math.ceil((1 - a) * 255) //この計算はおかしい

	  //const a = (a1 > 0) ? 0 : a0
	  //dst8[index + 3] = a * 255

	  // この計算もおかしい
	  const a = a0 - a1
	  dst8[index + 3] = a * 255
	  index += 4;
	}
      }
      dstData.data.set(dst8)
      this.page.ctx.putImageData(dstData, rect[0], rect[1])
      
      const result = Autosave.pushPage(this.page)
    }
  }

  rect() {
    let xmin = this.bound[0]
    let ymin = this.bound[1]
    let xmax = this.bound[2]
    let ymax = this.bound[3]

    if (xmin > xmax) [xmin, xmax] = [xmax, xmin]
    if (ymin > ymax) [ymin, ymax] = [ymax, ymin]

    xmin -= 1;
    ymin -= 1;
    xmax += 1;
    ymax += 1;

    if (xmin < 0) xmin = 0
    if (ymin < 0) ymin = 0
    if (xmax > this.canvas.width - 1) xmax = this.canvas.width - 1
    if (ymax > this.canvas.height - 1) ymax = this.canvas.height - 1

    return [xmin, ymin, xmax - xmin, ymax - ymin]
  }
  
  __rect() {
    const bound = this.bound
    bound[0] -= 1;
    bound[1] -= 1;
    bound[2] += 1;
    bound[3] += 1;

    const xmin = (bound[0] > 0) ? bound[0] : 0
    const ymin = (bound[1] > 0) ? bound[1] : 0
    const xmax = (bound[2] < this.canvas.width-1) ? bound[2] : this.canvas.width-1
    const ymax = (bound[3] < this.canvas.height-1) ? bound[3] : this.canvas.height-1
    return [xmin, ymin, xmax - xmin, ymax - ymin]
  }

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
  }

  clearBound() {
    const rect = this.rect()
    this.ctx.clearRect(...rect)
  }

  setBound(x0, y0, x1, y1) {
    this.bound = [x0, y0, x1, y1]
  }
  
  initBound(x, y, d) {
    this.setBound(x - d, y - d, x + d, y + d)
  }

  updateBound(x, y, d) {
    const bound = this.bound
    if (bound[0] > x - d) bound[0] = x - d
    if (bound[1] > y - d) bound[1] = y - d
    if (bound[2] < x + d) bound[2] = x + d
    if (bound[3] < y + d) bound[3] = y + d
  }
}


export { Scratch }

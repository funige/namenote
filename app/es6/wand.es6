'use strict'

import { helper } from './helper.es6'


class Wand {
  constructor(project) {
    this.project = project
    this.page = null
    
    this.element = document.createElement('div')

    this.element.className = 'wand'
    this.element.style.display = 'none'
  }

  destructor() {
    this.project = null
  }
  
  attach(page) {
    this.page = page
    this.page.root.insertBefore(this.element, this.page.canvas.nextSibling)

    this.clearBound()
    this.element.style.display = 'block'
  }

  detach() {
    if (this.page) {
      this.page = null
    }
    this.element.style.display = 'none'
  }

  rect() {
    let xmin = this.bound[0]
    let ymin = this.bound[1]
    let xmax = this.bound[2]
    let ymax = this.bound[3]

    if (xmin > xmax) [xmin, xmax] = [xmax, xmin]
    if (ymin > ymax) [ymin, ymax] = [ymax, ymin]
//  if (xmin > xmax) { const tmp = xmin; xmin = xmax; xmax = tmp }
//  if (ymin > ymax) { const tmp = ymin; ymin = ymax; ymax = tmp }
    
    const width = (this.page) ? this.page.project.pageSize[0] : 0
    const height = (this.page) ? this.page.project.pageSize[1] : 0
    if (xmin < 0) xmin = 0
    if (ymin < 0) ymin = 0
    if (xmax > width - 1) xmax = width - 1
    if (ymax > height - 1) ymax = height - 1

    return [xmin, ymin, xmax - xmin, ymax - ymin]
  }

  setBound(x0, y0, x1, y1) {
    this.bound = [x0, y0, x1, y1]
  }

  clearBound() {
    this.setBound(0, 0, 0, 0)
    this.updateBound(0, 0)
  }
  
  initBound(x, y) {
    this.setBound(x, y, x, y)
  }

  updateBound(x, y) {
    const bound = this.bound
    bound[2] = x
    bound[3] = y

    const rect = this.rect()
    this.element.style.left = rect[0] + 'px'
    this.element.style.top = rect[1] + 'px'
    this.element.style.width = rect[2] + 'px'
    this.element.style.height = rect[3] + 'px'
  }

  selectText() {
    this.project.selection.clear()

    if (this.page) {
      const rect = this.rect()
      const texts = this.page.texts

      for (const node of texts.children) {
	const x = parseFloat(node.style.left)
	const y = parseFloat(node.style.top)
	const width = node.offsetWidth
	const height = node.offsetHeight

	if (helper.intersectRect(rect, [x, y, width, height])) {
	  this.project.selection.add(node)
	}
      }
    }
  }
}


export { Wand }

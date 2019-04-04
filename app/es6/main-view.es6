'use strict'

import { View } from './view.es6'
import { projectManager } from './project-manager.es6'

// $('.main-view')[0].parentNode.scrollTop = ...

////////////////////////////////////////////////////////////////

class MainView extends View {
  constructor(element) {
    super(element)

    this.init()
  }

  createPageElement(pid) {
    const element = document.createElement('div')
    element.className = 'page preload'
    element.id = 'page-' + pid
    return element
  }

  getPageElement(pid) {
    return document.getElementById('page-' + pid)
  }
  
  init() {
    this.scale = 1
    this.element.innerHTML = ''
//  this.element.style.backgroundColor = "red"

    const project = projectManager.current
    if (!project) return

//  const rect = this.projectRect()
//  this.element.style.width = PX(1000)
//  this.element.style.height = PX(4000)
    
    project.pids().forEach((pid, index) => {
      const pageElement = this.createPageElement(pid)
      this.element.appendChild(pageElement)
      this.updatePageRect(pid, index)

      if (project.pages[index]) {
        const page = project.pages[index]
        page.initElements()
      }
    })
  }

  pageRect(index) {
    const project = projectManager.current
    
    const width = parseInt(project.exportSize[0] * this.scale)
    const height = parseInt(project.exportSize[1] * this.scale)
    const margin = 50

    const x = index * (width + margin) + margin
    const y = margin
    return { x:x, y:y, width:width, height:height }
  }

  /*projectRect() {
    const project = projectManager.current

    const pageCount = project.pids().length

    const width = project.exportSize[0]
    const height = project.exportSize[1]
    const margin = 50

    return { x: 0,
             y: 0,
             width: (width + margin) * pageCount + margin,
             height: height + margin + margin
           }
  }*/
  
  update() {
    projectManager.current.pids().forEach((pid, index) => {
      this.updatePageRect(pid, index)
    })
  }

  updatePageRect(pid, index) {
    const pageElement = this.getPageElement(pid)
    const rect = this.pageRect(index)
    if (pageElement) {
      pageElement.style.width = PX(rect.width)
      pageElement.style.height = PX(rect.height)
      pageElement.style.left = PX(rect.x)
      pageElement.style.top = PX(rect.y)
    }
    
    const project = projectManager.current
    const page = project.pages[index]
    if (page) {
      page.canvas.style.transform = `scale(${this.scale})`
      page.texts.style.transform = `scale(${this.scale})`
    }
  }

  getRect() {
    //マージンの計算。ビューのマージンはスケールしない。
    const node = this.element.parentNode
    return { x: node.scrollLeft,
             y: node.scrollTop,
             width: parseInt(node.clientWidth / this.scale),
             height: parseInt(node.clientHeight / this.scale) }
  }
  
  isVisible(pid) {
    const project = projectMaanger.current
    const index = project.pids().indexOf(pid)
    if (index >= 0) {
      const rect = this.pageRect(index)
    }
  }

  indexOf(pid) {
    return projectManager.current.pids().indexOf(pid)
  }
  
  zoom() {
    if (!projectManager.current) return
    this.scale /= 0.9
    this.update()
  }

  unzoom() {
    if (!projectManager.current) return
    this.scale *= 0.9
    this.update()
  }
}

export { MainView }

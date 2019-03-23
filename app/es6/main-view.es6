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

  createProjectElement() {
    const element = document.createElement('div')
    element.className = 'project'
    return element
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
    
    const project = projectManager.current
    if (!project) return
    WARN('mainView init', project.name())

    this.projectElement = this.createProjectElement()
    this.element.appendChild(this.projectElement)

    project.pids().forEach((pid, index) => {
      const pageElement = this.createPageElement(pid)
      const rect = this.pageRect(index)

      pageElement.style.width = PX(rect.width)
      pageElement.style.height = PX(rect.height)
      pageElement.style.left = PX(rect.x)
      pageElement.style.top = PX(rect.y)
      this.projectElement.appendChild(pageElement)

      if (project.pages[index]) {
        const page = project.pages[index]
        page.render()
      }
    })
  }

  pageRect(index) {
    const width = 300
    const height = 400
    const margin = 50

    const x = index * (width + margin)
    const y = 0
    return { x:x, y:y, width:width, height:height }
  }
  
  update() {
  }

}

export { MainView }

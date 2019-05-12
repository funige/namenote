'use strict'

import { View } from './view.es6'
import { projectManager } from './project-manager.es6'

import { recentURL } from './recent-url.es6'
import { menu } from './menu.es6'
import { title } from './title.es6'
import { viewButton } from './view-button.es6'

// $('.main-view')[0].parentNode.scrollTop = ...

////////////////////////////////////////////////////////////////

class MainView extends View {
  constructor(element) {
    super(element)
    this.id = 'main'
    this.init()
  }

  init() {
  }
  
  async loadProject(project) {
    LOG('mainView loadProject', project)
    if (this.project) this.project.removeView(this)
    this.project = project
    if (!project) return
    project.addView(this)

    recentURL.add(project.url)
    menu.update()
    viewButton.update()
    title.set(project ? project.name() : null)

    ////////////////
    
    this.scale = 1
    this.pageData = {}
    this.initProject(project)
  }

  initProject(project) {
    this.element.innerHTML = ''
    project.pids().forEach((pid, index) => {
      const pageElement = this.createPageElement(pid)
      this.element.appendChild(pageElement)
      this.pageData[pid] = {
        element: pageElement
      }
      
      this.updatePage(pid, index)
      if (project.pages[index]) {
        const page = project.pages[index]
        this.initPage(page)
      }
    })
  }
  
  initPage(page) {
    const pd = this.pageData[page.pid]
    pd.canvas = this.createCanvas(page)
    pd.texts = this.createTexts(page, page.params.text)
    pd.canvas.className = 'canvas'
    pd.texts.className = 'texts'
    
    pd.ctx = pd.canvas.getContext('2d')
    pd.ctx.filter = 'none'
    pd.ctx.drawImage(page.canvas, 0, 0)

    if (pd.element) {
      $(pd.element).removeClass('preload')

      // とりあえず表示してみる
      pd.element.appendChild(pd.canvas)
      pd.element.appendChild(pd.texts)
    }
  }


  ////////////////
  
  createPageElement(pid) {
    const element = document.createElement('div')
    element.className = 'page preload'
    element.id = 'page-' + pid
    return element
  }
  
  getPageRect(index) {
    const width = parseInt(this.project.canvasSize[0] * this.scale)
    const height = parseInt(this.project.canvasSize[1] * this.scale)
    const margin = 50

    const x = index * (width + margin) + margin
    const y = margin
    return { x:x, y:y, width:width, height:height }
  }

  update() {
    this.project.pids().forEach((pid, index) => {
      this.updatePage(pid, index)
    })
  }

  updatePage(pid, index) {
    const pd = this.pageData[pid]
    const rect = this.getPageRect(index)
    
    if (pd.element) {
      pd.element.style.width = PX(rect.width)
      pd.element.style.height = PX(rect.height)
      pd.element.style.left = PX(rect.x)
      pd.element.style.top = PX(rect.y)
      //pd.element.style.display = (index == 0) ? "block" : "none" //debug
    }
    if (pd.canvas) pd.canvas.style.transform = `scale(${this.scale})`
    if (pd.texts) pd.texts.style.transform = `scale(${this.scale})`
  }

  zoom() {
    if (!this.project) return
    this.scale /= 0.9
    this.update()
  }

  unzoom() {
    if (!this.project) return
    this.scale *= 0.9
    this.update()
  }
}

export { MainView }




  /*
  getRect() {
    //マージンの計算。ビューのマージンはスケールしない。
    const node = this.element.parentNode
    return { x: node.scrollLeft,
             y: node.scrollTop,
             width: parseInt(node.clientWidth / this.scale),
             height: parseInt(node.clientHeight / this.scale) }
  }*/
  /*  
  isVisible(pid) {
    const index = this.project.pids().indexOf(pid)
    if (index >= 0) {
      const rect = this.getPageRect(index)
    }
  }*/
  /*
  indexOf(pid) {
    return this.project.pids().indexOf(pid)
  }*/
  

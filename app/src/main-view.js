import { View } from './view.js'
import { projectManager } from './project-manager.js'

import { recentURL } from './recent-url.js'
import { menu } from './menu.js'
import { title } from './title.js'
import { viewButton } from './view-button.js'

// $('.main-view')[0].parentNode.scrollTop = ...

////////////////////////////////////////////////////////////////

class MainView extends View {
  constructor(element) {
    super(element)
    this.id = 'main'

    this.enableSmoothScroll(element)
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
    this.steps = this.getSteps()
    
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
      if (project.pages[index]) {
        const page = project.pages[index]
        this.initPage(page)
      }
      
      this.updatePage(pid, index)
    })
  }
  
  initPage(page) {
    const pd = this.pageData[page.pid]
    pd.canvas = this.createCanvas(page)
    pd.texts = this.createTexts(page, page.params.text)
    pd.canvas.className = 'canvas'
    pd.texts.className = 'texts'
    
    pd.ctx = pd.canvas.getContext('2d')
    pd.ctx.filter = `blur(${this.getSteps()}px)`
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

  updateScale() {
    console.log(this.project, this.getSteps(), this.steps)
    const updateSteps = (this.steps != this.getSteps())
    this.steps = this.getSteps()
    
    this.project.pids().forEach((pid, index) => {
      this.updatePage(pid, index, updateSteps)
    })
  }

  updatePage(pid, index, updateSteps) {
    LOG('updatePage', pid, index, updateSteps)
    const pd = this.pageData[pid]
    const rect = this.getPageRect(index)
    
    if (pd.element) {
      pd.element.style.width = PX(rect.width)
      pd.element.style.height = PX(rect.height)
      pd.element.style.left = PX(rect.x)
      pd.element.style.top = PX(rect.y)
    }
    if (pd.texts) pd.texts.style.transform = `scale(${this.scale})`
    if (pd.canvas) pd.canvas.style.transform = `scale(${this.scale})`

    const page = this.project.pages[index]
    if (page && updateSteps) {
      pd.ctx.filter = `blur(${this.getSteps()}px)`
      pd.ctx.clearRect(0, 0, pd.canvas.width, pd.canvas.height)
      pd.ctx.drawImage(page.canvas, 0, 0)
    }
  }
  
  getSteps() {
    return (1.0 / this.scale) >> 1
  }
  
  zoom() {
    if (!this.project) return
    this.scale /= 0.9
    this.updateScale()
  }

  unzoom() {
    if (!this.project) return
    this.scale *= 0.9
    this.updateScale()
  }
}

export { MainView }


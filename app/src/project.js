import { namenote } from './namenote.js'
import { Page } from './page.js'
import { projectManager } from './project-manager.js'
import { file } from './file.js'
import { config } from './config.js'

const thumbnailWidths = {
  'small': 75,
  'middle': 106,
  'large': 150,
}

////////////////////////////////////////////////////////////////

class Project {
  constructor(url, json) {
//  url = url.replace(/\\/g, '/') //TODO:Windows対応は必要だがここは不適当
    this.url = url
    this.baseURL = url.replace(/\/[^/]*$/, '')

    this.pages = []
    this.currentPage = null

    this.views = []
    
//  this.finishPageRead = false
//  this.maxPID = 0
//  this.dirty = true

    if (json) {
      this.init(json)
    }
  }

  destructor() {
    log('project destructor', this.url)
    this.pages.forEach(page => {
      page.destructor()
    })

    this.views = []
  }

  init(data) {
    this.params = data.params
    this._pids = data.pids

    this.setDPI(this.params.dpi)
    this.pageSize = this.topx(this.params.page_size || [364, 364])
    this.canvasSize = this.topx(this.params.canvas_size || this.params.export_size || [257, 364])
    return this
  }

  pids() {
    return this._pids
  }
  
  name() {
    return file.truncateURL(this.url)
  }

  getElement() {
    return namenote.mainView.projectElement
  }

  addView(view) {
    if (this.views.indexOf(view) < 0) {
      this.views.push(view)
    }
  }
  
  removeView(view) {
    this.views = this.views.filter((item) => {
      return item !== view
    })
  }

  ////////////////
  
  setDPI(dpi) {
    this.dpi = dpi
  }

  topx(mm) {
    if (typeof mm === 'number') {
      return Math.round(mm * (this.dpi / 25.4))
    } else {
      return mm.map((x) => Math.round(x * (this.dpi / 25.4)))
    }
  }

  tomm(px) {
    if (typeof px === 'number') {
      return Math.round(px * (25.4 / this.dpi))
    } else {
      return px.map((x) => Math.round(x * (25.4 / this.dpi)))
    }
  }
  
  getThumbnailSize() {
    const size = config.getValue('thumbnailSize', 'middle')
    const thumbnailWidth = thumbnailWidths[size]
    const scale = thumbnailWidth / this.canvasSize[0]

    const width = Math.ceil(this.canvasSize[0] * scale)
    const height = Math.ceil(this.canvasSize[1] * scale)
    return { width:width, height:height }
  }
}

export { Project }

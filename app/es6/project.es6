'use strict'

import { namenote } from './namenote.es6'
import { Page } from './page.es6'
import { projectManager } from './project-manager.es6'

////////////////////////////////////////////////////////////////

class Project {
  constructor(url, json) {
//  url = url.replace(/\\/g, '/') //TODO:Windows対応は必要だがここは不適当
    this.url = url
    this.baseURL = url.replace(/\/[^/]*$/, '')

    this.pages = []
    this.currentPage = null

    this.finishPageRead = false
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
  }

  init(data) {
    this.params = data.params //$.extend({}, data.params)
    this._pids = data.pids //$.extend([], data.pids)

    this.setDPI(this.params.dpi)
    this.pageSize = this.topx(this.params.page_size)
    this.exportSize = this.topx(this.params.export_size)
    
    return this
  }

  pids() {
    return this._pids
  }
  
  name() {
    return projectManager.truncateURL(this.url)
  }

  getElement() {
    return namenote.mainView.projectElement
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
}

export { Project }

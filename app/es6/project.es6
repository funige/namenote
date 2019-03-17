'use strict'

import { Page } from './page.es6'

////////////////////////////////////////////////////////////////

class Project {
  constructor(url, json) {
//  url = url.replace(/\\/g, '/') //TODO:Windows対応は必要だがここは不適当

    this.url = url
    this.baseURL = url.replace(/\/[^/]*$/, '')

    this.pages = []
    this.currentPage = null
    this.maxPID = 0
    this.dirty = true

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
    this.params = $.extend({}, data.params)
    this._pids = $.extend([], data.pids)

/*
    const pageCount = this.params.page_count
    for (const i = 0; i < pageCount; i++) {
      const pid = (data.pids) ? data.pids[i] : null
      this.currentPage = this.appendPage(pid)
      this.currentPage.updateIndex(i + 1)
      if (this.maxPID < (pid || 0)) this.maxPID = pid
    }
    this.selectPage(this.pages[0].pid)
*/
    return this
  }
  
//findIndex(page) {
//  for (let i = 0; i < this.pages.length; i++) {
//    if (this.pages[i].pid == page.pid) {
//      return i
//    }
//  }
// return -1
//}
//
//name() {
//  return (this.url) ? this.url.replace(/^.*\//, '') : T('Untitled')
//}
}

export { Project }

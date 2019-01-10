'use strict'

import { Page } from './page.es6'

////////////////////////////////////////////////////////////////

class Project {
  constructor(url) {
    this.url = url.replace(/\\/g, '/')

    this.pages = []
    this.current = null
  }

  destructor() {
    log('project destructor', this.url)
    
    this.pages.forEach(page => {
      page.destructor()
    })
  }

  findIndex(page) {
    for (let i = 0; i < this.pages.length; i++) {
      if (this.pages[i].pid == page.pid) {
        return i
      }
    }
    return -1
  }
}

export { Project }

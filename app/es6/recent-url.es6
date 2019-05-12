'use strict'

import { projectManager } from './project-manager.es6'
import { menu } from './menu.es6'

const max = 10

////////////////////////////////////////////////////////////////

class RecentURL {
  constructor() {
    this.data = []
  }

  load() {
    const json = localStorage.getItem('namenote/recent-url')
    this.data = (json) ? JSON.parse(json) : []
  }

  save() {
    const json = JSON.stringify(this.data)
    localStorage.setItem('namenote/recent-url', json)
  }

  resetStorage() {
    this.data = []
    this.save()
    menu.update()
  }

  add(url) {
    if (!url.match(/:\/\/\//)) {
      ERROR('irregal url!!!', url) //TODO
    }
    
    this.data = this.data.filter((value) => value != url)
    this.data.unshift(url)

    if (this.data.length > max) {
      this.data.length = max
    }
    this.save()
  }
}

const recentURL = new RecentURL()

export { recentURL }

'use strict'

import { Project } from './project.es6'
import { recentURL } from './recent-url.es6'

////////////////////////////////////////////////////////////////

class ProjectManager {
  constructor() {
    this.projects = []
    this.current = null
  }

  select(project) {
    this.current = project
    recentURL.add(project.url)
  }

  findIndex(project) {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].url == project.url) {
        return i
      }
    }
    return -1
  }
  
  open(url) {
    const index = this.findIndex(url)
    if (index < 0) {
      const project = new Project(url)
      this.projects.push(project)
      this.select(project)
      return Promise.resolve(project)
      
    } else {
      const project = this.projects[index]
      this.select(project)
      return Promise.resolve(project)
    }
  }
}

const projectManager = new ProjectManager

export { projectManager }

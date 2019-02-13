'use strict'

import { namenote } from './namenote.es6'

import { Project } from './project.es6'
import { recentURL } from './recent-url.es6'
import { menu } from './menu.es6'
import { title } from './title.es6'
import { viewButton } from './view-button.es6'


////////////////////////////////////////////////////////////////

class ProjectManager {
  constructor() {
    this.projects = []
    this.current = null
  }

  select(project) {
    if (project) {
      const index = this.findIndex(project.url)
      if (index < 0) {
        this.projects.push(project)
      }
      recentURL.add(project.url)
    }
    
    this.current = project
    namenote.mainView.setProject(project)
    title.set(project ? project.name() : null)

    menu.update()
    viewButton.update()
  }

  open(url) {
    const index = this.findIndex(url)
    const project = (index >= 0) ? this.projects[index] : new Project(url)

    this.select(project)
    return Promise.resolve(project)
  }
  
  close(project) {
    warn('[close]', project)
    if (!project) project = this.current
    if (!project) return

    const index = this.findIndex(project.url)
    if (index >= 0) {
      this.projects.splice(index, 1)
      if (project == this.current) {
        this.select(this.projects[this.projects.length - 1])
      }
      project.destructor()
    }
  }

  findIndex(url) {
    for (let i = 0; i < this.projects.length; i++) {
      if (this.projects[i].url == url) {
        return i
      }
    }
    return -1
  }
}

const projectManager = new ProjectManager

export { projectManager }

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
  }

  select(project) {
    LOG('[projetManager select]', project)
    
    if (project) {
      if (!this.find(project.url)) {
        this.projects.push(project)
      }
      recentURL.add(project.url)
    }

    //namenote.views.forEach((view) => {
    //  view.loadProject(project)
    //})
    namenote.mainView.loadProject(project)
    
    menu.update()
    viewButton.update()

    title.set(project ? project.name() : null)
  }
  
  find(url) {
    for (const project of this.projects) {
      if (project.url == url) {
        return project
      }
    }
    return null
  }
}

const projectManager = new ProjectManager

export { projectManager }

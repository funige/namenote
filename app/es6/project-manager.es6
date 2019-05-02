'use strict'

import { namenote } from './namenote.es6'
import { Project } from './project.es6'
import { file } from './file.es6'
import { dialog } from './dialog.es6'

////////////////////////////////////////////////////////////////

class ProjectManager {
  constructor() {
    this.projects = []
  }

  async get(url, monitor) {
    let project = this.find(url)
    if (!project) {
      project = await file.readProject(url, monitor)
      file.readPages(project, monitor).then(() => {
        LOG('readPages finishded')
        if (monitor && monitor == dialog.current) {
          dialog.close()
        }
      })
      this.projects.push(project)
    }
    return project
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

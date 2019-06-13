import { namenote } from './namenote.js'
import { Project } from './project.js'
import { file } from './file.js'
import { dialog } from './dialog.js'

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
      this.addProject(project)

    } else {
      if (monitor && monitor == dialog.current) {
        dialog.close()
      }
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

  addProject(project) {
    this.projects.push(project)
    namenote.noteView.update(project)
  }
}

const projectManager = new ProjectManager

export { projectManager }

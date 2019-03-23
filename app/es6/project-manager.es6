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
    LOG('[projetManager select]', project)
    
    if (project) {
      if (!this.find(project.url)) {
        this.projects.push(project)
      }
      recentURL.add(project.url)
    }
    
    this.current = project
    namenote.mainView.init()
    
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

  truncateURL(url) {
    url = url.replace(/[^/]*\.namenote$/, '')
    url = url.replace(/\/$/, '')
    url = url.replace(/^.*\//, '')
    return url
  }

  /*
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
  */

  /*
  findProjectName(url) {
    return new Promise((resolve, reject) => {
      if (url.match(/.namenote$/)) {
        resolve(url)

      } else {
        if (namenote.app) {
          namenote.app.readdir(url, (err, files) => {
            for (const item of files) {
              if (item.lastIndexOf('.namenote') == 1) {
                return resolve(`${url}/${item}`)
              }
            }
          })
        } else {
          reject('not implemented yet.')
        }
      }
    })
  }
  */
}

const projectManager = new ProjectManager

export { projectManager }

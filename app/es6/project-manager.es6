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
/*
  project.verify(url) {
    return Promise.resolve()
  }

  
  open(url) {
    return new Promise((resolve, reject)) => {
      const project =find(url)
      if (project) {
        //メモリにあれば最新か確認
        project.verify(() => {
          resolve(project)
        }, () => {
          project = new Project(url)
          resolve(project)
        })
      }
      
      //メモリにない/最新でない時はnew
      project = new Project(url)
      resolve(project)
    }
  }

  //apiの設計・・・

  command.openDialog().then((url) => {
    const project = projectManager.open(url)
    resolve(project)

  }).then((project) => {
    project.load()
    resolve()

  }).then((project) => {
    Promise.all(project.pages.map(getPage))
}).then(page) {
  }).catch((error) => {
    //error
  )}

  command.open(raw_url).then((url) => {
    const project = projectManager.open(url)
    resolve(project)

  }).then((project) => {
    project.load()
    resolve()

  }).catch((error) => {
    //error
  )}

  ////command.open(raw_url).then((url) => {
  ////  projectManager.open(url).then((project) => {
  ////  project.load()})
  ////})
  ////command.openDialog().then((url) => {
  ////  projectManager.open(url).then((project) => {
  ////  project.load()})
  ////})
*/
  
  open(url) {
    return new Promise((resolve, reject) => {
      let project = this.find(url)
      if (!project) {
        project = new Project(url)
        this.projects.push(project)
      }
      if (project) {
        resolve(this.select(project))
      }
      reject("maybe bad url..")
    })
  }

  find(url) {
    for (const project of this.projects) {
      if (prject.url == url) {
        return project
      }
    }
    return null
  }

  select(project) {
    this.current = project
    title.set(project ? project.name() : null)
    recentURL.add(project)

    mainView.setProject(project)
    menu.update()
    viewButton.update()
  }
  
  /*
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

'use strict'

import { dialog } from './dialog.es6'
import { Project } from './project.es6'
import { Page } from './page.es6'

import { projectManager } from './project-manager.es6'

//import { OpenDialog } from './open-dialog.es6'
import { MessageBox } from './message-box.es6'

////////////////////////////////////////////////////////////////

class FileSystem {
  constructor() {
  }

  init() {
  }

  readJSON(url) {
    return new Promise((resolve, reject) => {
      this.readFile(url, (err, json) => {
        if (err) {
          return reject(err)
        }
        resolve(JSON.parse(json))
      }) 
    })
  }
  
  writeJSON(url, data) {
    return new Promise((resolve, reject) => {
      this.writeFile(url, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      }) 
    })
  }

  readProject(url) {
    return this.readJSON(url).then((json) => {
      return new Project(url, json)
    })
  }

  readPage(url) {
    return this.readJSON(url).then((json) => {
      return new Page(json)
    })
  }

  readPages(project, messageBox) {
    return Promise.all(project._pids.map((pid, index) => {
      return new Promise((resolve, reject) => {
        const pageURL = `${project.baseURL}/${pid}.json`
        this.readPage(pageURL).then((page) => {
          page.pid = pid
          project.pages[index] = page

          if (!page.width) page.width = project.pageSize[0]
          if (!page.height) page.height = project.pageSize[1]
          page.initElements()

          LOG('=page=', pid, page)
          messageBox.showProgress(`${pageURL}`)

        }).catch((error) => {
          ERROR('=page=', pid, error)
          messageBox.showProgress(`${pageURL}: error`)
            
        }).then(resolve)
      })
    }))
  }
  
  open(url) {
    const tmp = require('url').parse(url)
    WARN(`open ${url}..${tmp.protocol} ${tmp.pathname}`)
    if (!this.auth('open', url)) return

    this.completePath(url, 'namenote').then((url) => {
      const project = projectManager.find(url)
      if (project) {
        projectManager.select(project)
        
      } else {
        const messageBox = new MessageBox()
        dialog.open(messageBox, {
          title: 'Open',
          message: `Loading ...`,
          cancel: 'Cancel'

        }).catch(() => { // when cancel pressed
          dialog.close()
        })
        
        this.readProject(url).then((project) => {
          projectManager.select(project)
          return this.readPages(project, messageBox)

        }).then(() => {
          WARN('finished')
          dialog.close()

        }).catch((error) => dialog.alert(error)) // project open error
      }
    }).catch((error) => dialog.alert(error))
  }
  
  completePath(url, extension = 'namenote') {
    const regexp = new RegExp(extension + '$', 'i')
    if (url.match(regexp)) {
      return Promise.resolve(url)

    } else return new Promise((resolve, reject) => {
      this.stat(url, (err, stats) => {
        if (err || stats.isFile()) {
          return reject()

        } else {
          this.readdir(url, (err, dirents) => {
            if (err) return reject()
            
            for (const dirent of dirents) {
              if (!dirent.isDirectory() && dirent.name.match(regexp)) {
                return resolve(`${url}/${dirent.name}`)
              }
            }
            return reject()
          })
        }
      })
    })
  }

  parse(url) {
    const arr = url.split(':')
  }
  
  auth() { return true }
  logout() {}
}

export { FileSystem }


  /*__completePath(url, extension = 'namenote') {
    const regexp = new RegExp(extension + '$', 'i')
    return new Promise((resolve, reject) => {
      this.stat(url, (err, stats) => {
        if (err) return reject('File open error.')
        
        if (stats.isFile()) {
          resolve(url)

        } else {
          this.readdir(url, (err, dirents) => {
            if (err) return reject('File open error.')
            
            for (const dirent of dirents) {
              if (!dirent.isDirectory() && dirent.name.match(regexp)) {
                return resolve(`${url}/${dirent.name}`)
              }
            }
            reject('File open error.')
          })
        }
      })
    })
  }*/


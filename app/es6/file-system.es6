'use strict'

import { dialog } from './dialog.es6'
import { Project } from './project.es6'
import { Page } from './page.es6'

import { openDialog } from './open-dialog.es6'

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
  
  open(url) {
    if (!this.auth('open', url)) return
    WARN(`open ${url}..`)

    this.completePath(url, 'namenote').then((url) => {
      return this.readProject(url)

    }).then((project) => {
      LOG('=project=', project)

      return Promise.all(project._pids.map((pid, index) => {
        return new Promise((resolve, reject) => {
          const pageURL = `${project.baseURL}/${pid}.json`
          this.readPage(pageURL).then((page) => {
            LOG('=page=', pid, page)
          
            page.pid = pid
            project.pages[index] = page

          }).catch((error) => {
            LOG(error)
            
          }).then(resolve)
        })
      }))

    }).then(() => {
      LOG('finished')

    }).catch((error) => dialog.alert(error))
  }

  completePath(url, extension = 'namenote') {
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
  }

  auth() { return true }
  logout() {}
}

export { FileSystem }

import { dialog } from './dialog.js'
import { Project } from './project.js'
import { Page } from './page.js'
import { projectManager } from './project-manager.js'

import { LocalFileSystem } from './local-file-system.js'
import { DropboxFileSystem } from './dropbox-file-system.js'

import { MessageBox } from './message-box.js'
import { OpenDialog } from './open-dialog.js'
import { OpenNewDialog } from './open-new-dialog.js'

import { SavePageImageDialog } from './save-page-image-dialog.js'
import { ExportPDFDialog } from './export-pdf-dialog.js'
import { ExportCSNFDialog } from './export-csnf-dialog.js'

////////////////////////////////////////////////////////////////

class File {
  constructor() {
    this.systems = {}
  }

  async openDialog() {
    const fileSystem = this.getFileSystem(this.getDefaultScheme())
    if (!fileSystem.auth('openDialog')) return
    
    const project = await dialog.open(new OpenDialog())
    dialog.close()

    if (project) {
      namenote.mainView.loadProject(project)
      namenote.pageView.loadProject(project)
      namenote.textView.loadProject(project)
    }
  }

  async open(url) {
    const fileSystem = this.getFileSystem(this.getScheme(url))
    if (!fileSystem.auth('open', url)) return

    const projectURL = await this.getProjectURL(url)
    if (projectURL) {
      const messageBox = new MessageBox()
      dialog.open(messageBox, {
        title: 'Open',
        message: `Loading ...`,
        cancel: 'Cancel'
      }).then(() => { dialog.close() })

      const project = await projectManager.get(projectURL, messageBox)
      namenote.mainView.loadProject(project)
      namenote.pageView.loadProject(project)
      namenote.textView.loadProject(project)
    }
  }

  async savePageImageDialog() {
    const result = await dialog.open(new SavePageImageDialog())
    dialog.close()
  }
  async exportPDFDialog() {
    await dialog.open(new ExportPDFDialog())
    dialog.close()
  }
  async exportCSNFDialog() {
    await dialog.open(new ExportCSNFDialog())
    dialog.close()
  }
    
  async openNewDialog() {
    const fileSystem = this.getFileSystem(this.getDefaultScheme())
    if (!fileSystem.auth('openNewDialog')) return
    
    const project = await dialog.open(new OpenNewDialog())
    dialog.close()

    if (project) {
      namenote.mainView.loadProject(project)
      namenote.pageView.loadProject(project)
      namenote.textView.loadProject(project)
    }
  }
  
  async logout(scheme) {
    const fileSystem = this.getFileSystem(scheme)
    LOG('logout', scheme, fileSystem)
    fileSystem.logout()
  }

  async readdir(url) {
    return new Promise((resolve, reject) => {
      const fileSystem = this.getFileSystem(this.getScheme(url))
      const path = this.getPath(url)
      fileSystem.readdir(path, (err, dirents) => {
        if (err) {
          return reject(err)
        }
        resolve(dirents)
      })
    })
  }
  
  async readJSON(url) {
    return new Promise((resolve, reject) => {
      const fileSystem = this.getFileSystem(this.getScheme(url))
      const path = this.getPath(url)
      fileSystem.readFile(path, (err, json) => {
        if (err) {
          return reject(err)
        }
        resolve(JSON.parse(json))
      }) 
    })
  }
  
  async writeJSON(url, data) {
    return new Promise((resolve, reject) => {
      const fileSystem = this.getFileSystem(this.getScheme(url))
      const path = this.getPath(url)
      fileSystem.writeFile(path, JSON.stringify(data), (err) => {
        if (err) {
          return reject(err)
        }
        resolve()
      }) 
    })
  }

  async readProject(url) {
    return this.readJSON(url).then((json) => {
      return new Project(url, json)
    })
  }

  async readPage(url) {
    return this.readJSON(url).then((json) => {
      return new Page(json)
    })
  }

  async readPages(project, monitor) {
    return Promise.all(project._pids.map((pid, index) => {
      return new Promise((resolve, reject) => {
        const pageURL = `${project.baseURL}/${pid}.json`
        this.readPage(pageURL).then((page) => {
          page.pid = pid
          page.width = project.pageSize[0]
          page.height = project.pageSize[1]

          project.pages[index] = page
          page.initElements(project).then(() => {
            project.views.forEach((view) => {
              view.initPage(page)
            })
          })
          if (monitor) {
            monitor.showProgress(`${pageURL}`)
          }

        }).catch((error) => {
          ERROR('=page=', pid, error)
            
        }).then(resolve)
      })
    }))
  }

  ////////////////

  async getProjectURL(url) {
    if (url.match(/\.namenote$/i)) return url

    try {
      const dirents = await file.readdir(url)
      for (const dirent of dirents) {
        if (!dirent.isDirectory() && dirent.name.match(/\.namenote$/i)) {
          return `${url}${dirent.name}`
        }
      }
    } catch (e) { ERROR(e) }
    return null
  }
  
  getScheme(url) {
    LOG('getScheme', url)
    const arr = url.split(':')
    return (arr.length > 1 && arr[0]) ? arr[0] : 'file'
  }

  getPath(url) {
    const arr = url.split(':')
    const result = (arr.length > 1) ? arr.slice(1).join(':') : url
    return result.replace(/^\/+/, '/')
  }

  getFileSystem(scheme) {
    if (!this.systems[scheme]) {
      if (scheme == 'file') {
        this.systems[scheme] = new LocalFileSystem()
      } else if (scheme == 'dropbox') {
        this.systems[scheme] = new DropboxFileSystem()
      }
    }
    return this.systems[scheme]
  }

  getDefaultScheme() {
    return (namenote.app) ? 'file' : 'dropbox'
  }

  getHome() {
    if (namenote.app) {
      return `file://${namenote.homePath}/`
    } else {
      return 'dropbox:///'
    }
  }
  
  truncateURL(url) {
    url = url.replace(/[^/]*\.namenote$/, '')
    url = url.replace(/\/$/, '')
    url = url.replace(/^.*\//, '')
    return url
  }

  getLabel(url) {
    const scheme = this.getScheme(url)
    const path = this.getPath(url)
    const label = this.truncateURL(url)
    return { text: label,
             path: path,
             scheme: scheme,
             icon: 'ui-icon-note' }
  }
}

const file = new File()

export { file }

'use strict'

import { View } from './view.es6'
import { file } from './file.es6'
import { recentURL } from './recent-url.es6'
import { projectManager } from './project-manager.es6'

const MAX_FILES_IN_FOLDER = 1000

////////////////////////////////////////////////////////////////

class FileView extends View {
  constructor(element, dialogElement) {
    super(element, dialogElement)
    this.id = 'file'
    this.init()
  }

  init() {
    this.url = null
    this.project = null
    
    $(this.element).html(`
      <center style='height:40px;'>
        <select class='folders'></select>
      </center>
      <ul class='files'></ul>
      <ul class='items' style='display:none;'>
      </ul>`)

    this.items = $(this.element).find('.items')[0]
    this.files = $(this.element).find('.files')[0]
    $(this.files).selectable({
      filter: 'li:not(.disabled)',
      autoRefresh: false,
      delay: 0,
      selecting: (event, ui) => {
        $(event.target).find('.ui-selectee.ui-selecting').not(ui.selecting)
          .removeClass('ui-selecting');
        $(event.target).find('.ui-selectee.ui-selected').not(ui.selecting)
          .removeClass('ui-selected');
      },
      selected: (event, ui) => {
        const newurl = `${this.url}${ui.selected.getAttribute('value')}/`
        this.load(newurl)
      }
    })
    $(this.items).sortable({
      filter: 'li:not(.disabled)',
      autoRefresh: false,
      delay: 0,
    })

    this.folders = $(this.element).find('.folders')[0]
    $(this.folders).iconselectmenu({
      change: (event, ui) => {
        if (ui.item && ui.item.value) {
          const newurl = ui.item.value
          this.load(newurl)
        }
      },
    })

    this.load(file.getHome())
  }

  initProject(project) {
    this.items.innerHTML = ''
    project.pids().forEach((pid, index) => {
      const pageElement = this.createPageElement(pid)
      this.items.appendChild(pageElement)
      this.pageData[pid] = {
        element: pageElement
      }

      this.updatePage(pid, index)
      if (project.pages[index]) {
        const page = project.pages[index]
        this.initPage(page)
      }
    })
  }
  
  initPage(page) {
    const pd = this.pageData[page.pid]
    if (pd.element) {
      $(pd.element).html(`--init page-- ${page.pid}`)
    }
  }
  
  ////////////////

  createPageElement(pid) {
    const element = document.createElement('li')
    return element
  }

  updatePage(pid, index) {
    LOG('updatePage', pid, index)
  }
  
  ////////////////

  showFolders() {
    $(this.folders).parent().show()
    $(this.files).css('height', 'calc(100% - 40px)')
    $(this.items).css('height', 'calc(100% - 40px)')
  }

  hideFolders() {
    $(this.folders).parent().hide()
    $(this.files).css('height', 'calc(100%)')
    $(this.items).css('height', 'calc(100%)')
  }

  showItems() {
    $(this.items).show()
    $(this.files).hide()
    this.dialogElement.enable()
  }

  hideItems() {
    $(this.items).hide()
    $(this.files).show()
    this.dialogElement.disable()
  }
  
  ////////////////
  
  async load(url) {
    if (url.match(/\.namenote$/i)) {
      const project = await projectManager.get(url)
      this.loadProject(project)

    } else {
      this.loadFolder(url)
    }
  }

  async loadFolder(url) {
    try {
      const dirents = await file.readdir(url)
      if (dirents.length > MAX_FILES_IN_FOLDER) {
        return alert(T('Too many files in this folder.'))
      }

      for (const dirent of dirents) {
        if (!dirent.isDirectory() && dirent.name.match(/\.namenote$/i)) {
          const project = await projectManager.get(`${url}${dirent.name}`)
          return this.loadProject(project)
        }
      }

      WARN(`[load folder] ${url}`)
      this.hideItems()
      
      const tmp = []
      for (const dirent of dirents) {
        if (dirent.name.match(/^\./)) continue
        const icon = dirent.isDirectory() ? 'ui-icon-folder-open' : 'ui-icon-blank'
        const disabled = dirent.isDirectory() ? '': 'disabled'
        tmp.push(`
          <li class='${disabled}' value='${dirent.name}'>
            <span class='ui-icon ${icon}'></span>
            ${dirent.name}
          </li>`)
      }
      $(this.files).html(tmp.join(''))
      $(this.files).selectable('refresh')
      this.updateFolders(url)
      
    } catch(e) {
      ERROR(e, e.toString())
      return alert(T('Folder open error.'))
    }
  }

  async loadProject(project) {
    if (this.project) this.project.removeView(this)
    this.project = project
    if (!project) return
    project.addView(this)

    WARN(`[load project] ${project.url}`)
    this.showItems()

    this.pageData = {}
    this.initProject(project)

    this.updateFolders(project.url.replace(/[^/]+\/[^/]+$/, ''), project.url)
  }

  updateFolders(url, projectURL) {
    this.url = url
    
    const ancestors = this.getAncestors(url)
    const tmp = []

    if (projectURL) {
      const label = file.getLabel(projectURL)
      tmp.push(`<option data-class='${label.icon}' value='${projectURL}'>${label.text}</option>`)
    }
    
    for (const item of ancestors) {
      const label = file.getLabel(item)
      tmp.push(`<option value='${item}'>${label.path}</option>`)
    }

    const str = T("Recent Notes")
    tmp.push(`<option disabled>${str}</option>`)

    for (const item of recentURL.data) {
      const label = file.getLabel(item)
      tmp.push(`<option data-class='${label.icon}' value='${item}'>${label.text}</option>`)
    }
    
    $(this.folders).html(tmp.join(''))
    $(this.folders).iconselectmenu('refresh')
  }

  getAncestors(url) {
    url = `${file.getScheme(url)}:${file.getPath(url)}`
    const arr = url.split('/')
    const result = []
    arr.pop()

    let ext = (url.match(/\.namenote$/i)) ? '' : '/'
    do {
      result.push(arr.join('/') + ext)
      ext = '/'
      arr.pop()
    } while (arr.length > 0)
    return result
  }

  showProgress(message) {
    WARN('fileView: show progress', message)
  }

  showSpinner() {
    WARN('[show spinner]')
  }

  hideSpinner() {
    WARN('[hide spinner]')
  }
}

export { FileView }

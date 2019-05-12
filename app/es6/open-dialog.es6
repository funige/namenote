'use strict'

import { namenote } from './namenote.es6'
import { locale } from './locale.es6'
import { dialog } from './dialog.es6'
import { file } from './file.es6'
import { recentURL } from './recent-url.es6'

import { projectManager } from './project-manager.es6'
import { FileView } from './file-view.es6'

const MAX_FILES_IN_FOLDER = 1000

////////////////////////////////////////////////////////////////

class OpenDialog {
  constructor() {
    this.id = 'open-dialog'
  }

  destructor() {
    this.fileView.destructor()
    this.element = null
  }

  init() {
    this.url = null
    
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = () => { resolve(this.fileView.project) }
      buttons[T('Cancel')] = () => { resolve() }
      
      const string = locale.translateHTML(`
        <div class='file-dialog' style='height:400px;'>
          <center style='height:40px;'>
            <select class='folders'></select>
          </center>
          <ul class='file-list' style='height: calc(100% - 40px);'></ul>
          <ul class='file-view' style='height: calc(100% - 40px); display:none;'></ul>
        </div>`)
      
      $(this.element).html(`<form id='open'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('Open'),
        modal: true,
        width: 550,
        buttons: buttons,
        open: () => {
          this.folders.focus()
        }
      })

      this.fileList = $(this.element).find('.file-list')[0]
      $(this.fileList).selectable({
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

      this.folders = $(this.element).find('.folders')[0]
      $(this.folders).iconselectmenu({
        change: (event, ui) => {
          if (ui.item && ui.item.value) {
            const newurl = ui.item.value
            WARN('change to:', newurl)
            this.load(newurl)
          }
        },
      })

      this.preview = $(this.element).find('.file-view')[0]
      this.fileView = new FileView(this.preview, this)
      this.load(file.getHome())
    })
  }

  async load(url) {
    if (url.match(/\.namenote$/i)) {
      this.showPreview()
      const project = await projectManager.get(url)
      this.fileView.loadProject(project)

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
          this.showPreview()
          const project = await projectManager.get(`${url}${dirent.name}`)
          return this.fileView.loadProject(project)
        }
      }

      WARN(`[load folder] ${url}`)
      this.hidePreview()
      
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
      $(this.fileList).html(tmp.join(''))
      $(this.fileList).selectable('refresh')
      this.updateFolders(url)
      
    } catch(e) {
      ERROR(e, e.toString())
      return alert(T('Folder open error.'))
    }
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
    arr[0] = arr[0] + '//'
    arr.pop()
    
    let ext = (url.match(/\.namenote$/i)) ? '' : '/'
    do {
      result.push(arr.join('/') + ext)
      ext = '/'
      arr.pop()
    } while (arr.length > 0)

    WARN('get ancestors', result)
    return result
  }

  ////////////////

  onresize(e) {
    const height = $(this.element).height()
    $('.file-dialog').height(height)
  }
  
  ////////////////

  /*showFolders() {
    $(this.folders).parent().show()
    $(this.fileList).css('height', 'calc(100% - 40px)')
    $(this.preview).css('height', 'calc(100% - 40px)')
  }

  hideFolders() {
    $(this.folders).parent().hide()
    $(this.fileList).css('height', 'calc(100%)')
    $(this.preview).css('height', 'calc(100%)')
  }*/

  showPreview() {
    $(this.preview).show()
    $(this.fileList).hide()
    this.enable()
  }

  hidePreview() {
    $(this.preview).hide()
    $(this.fileList).show()
    this.disable()
  }
  
  ////////////////

  enable() {
    $(this.element).parent()
      .find('.ui-dialog-buttonpane button:first')
      .button('enable')
  }

  disable() {
    $(this.element).parent()
      .find('.ui-dialog-buttonpane button:first')
      .button('disable')
  }
}

export { OpenDialog }

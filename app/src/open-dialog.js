import { namenote } from './namenote.js'
import { locale } from './locale.js'
import { dialog } from './dialog.js'
import { file } from './file.js'
import { recentURL } from './recent-url.js'

import { projectManager } from './project-manager.js'
import { PageView } from './page-view.js'
import { Finder } from './finder.js'

////////////////////////////////////////////////////////////////

class OpenDialog {
  constructor() {
    this.id = 'open-dialog'
  }

  destructor() {
    this.pageView.destructor()
    this.element = null
  }

  init() {
    this.url = null
    
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = () => { resolve(this.pageView.project) }
      buttons[T('Cancel')] = () => { resolve() }
      
      const string = locale.translateHTML(`
        <div class='file-dialog' style='height:400px;'>
          <center style='height:40px;'>
            <select class='folders'></select>
          </center>
          <ul class='file-list' style='height: calc(100% - 40px);'></ul>
          <ul class='page-view' style='height: calc(100% - 40px); display:none;'></ul>
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
          $(this.element).find('.folders').focus()
        }
      })

      const folders = $(this.element).find('.folders')[0]
      const fileList = $(this.element).find('.file-list')[0]
      this.finder = new Finder(folders, fileList, {
        selected: (url) => {
          this.load(url)
        }
      })
      
      const preview = $(this.element).find('.page-view')[0]
      this.pageView = new PageView(preview, {
        loaded: (url, projectURL) => {
          this.finder.updateFolders(url, projectURL)
        }
      })

      this.load(file.getHome())
    })
  }

  async load(url) {
    WARN('load', url)

    const projectURL = await file.getProjectURL(url)
    if (projectURL) {
      this.showPreview()
      const project = await projectManager.get(projectURL)
      if (project) {
        this.pageView.loadProject(project)
      }

    } else {
      this.hidePreview()
      this.finder.loadFolder(url)
    }
  }

  ////////////////

  onresize(e) {
    const height = $(this.element).height()
    $('.file-dialog').height(height)
  }
  
  ////////////////

  showPreview() {
    $(this.element).find('.page-view').show()
    $(this.element).find('.file-list').hide()
    this.enable()
  }

  hidePreview() {
    $(this.element).find('.file-list').show()
    $(this.element).find('.page-view').hide()
    this.disable()
  }
  
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

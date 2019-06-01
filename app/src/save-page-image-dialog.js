import { dialog } from './dialog.js'
import { file } from './file.js'
import { locale } from './locale.js'
import { Finder } from './finder.js'

////////////////////////////////////////////////////////////////

class SavePageImageDialog {
  constructor() {
    this.id = 'save-page-image-dialog'
  }

  destructor() {
    this.element = null
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = () => { this.saveParams(); resolve(this.result) }
      buttons[T('Cancel')] = () => { resolve() }

      const string = locale.translateHTML(`
        <div class='file-dialog' style='height:400px;'>
          <div style='height:80px;'>
            名前: <input class='filename' type='text' />
            <br/>
            場所: <select class='folders'></select>
          </div>
          <ul class='file-list' style='height: calc(100% - 80px);'></ul>
        </div>`)

      $(this.element).html(`<form id='save-page-image'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('Save Image'),
        modal: true,
        width: 550,
        buttons: buttons,
        open: () => {
          this.initParams()
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
      
      this.load(file.getHome())
    })
  }

  async load(url) {
    WARN('load', url)
    
    const projectURL = await file.getProjectURL(url)
    if (projectURL) {
      alert(T('Folder open error.'))

    } else {
      this.finder.loadFolder(url)
    }
  }

  initParams() {
    const filename = `${Date.now()}.png`
    $(this.element).find('input.filename').val(filename)
  }

  saveParams() {
    const filename = $(this.element).find('input.filename').val()
    this.result = `${this.finder.url}${filename}`
  }

  ////////////////

  onresize(e) {
    const height = $(this.element).height()
    $('.file-dialog').height(height)
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

export { SavePageImageDialog }


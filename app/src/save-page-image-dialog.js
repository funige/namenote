import { dialog } from './dialog.js'
import { file } from './file.js'
import { locale } from './locale.js'

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
      buttons[T('Ok')] = () => { resolve(true) }
      buttons[T('Cancel')] = () => { resolve() }

      const string = locale.translateHTML(`
        <div class='file-dialog' style='height:400px;'>
          <div style='height:80px;'>
            名前: <input class='filename' type='text'
style='font-size: 14px; padding-left: 5px; height:26px; width: 200px; margin-bottom: 5px;' />
            <br/>
            場所: <select class='folders'></select>
          </div>
          <ul class='file-list' style='height: calc(100% - 80px);'></ul>
        </div>`)

      $(this.element).html(`<form id='open-new'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('Save Image'),
        modal: true,
        width: 550,
        buttons: buttons,
        open: () => {
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
      
      this.load(file.getHome())
    })
  }

  async load(url) {
    if (url.match(/\.namenote$/i)) {
      this.showPreview()
      const project = await projectManager.get(url)
      this.pageView.loadProject(project)

    } else {
      this.loadFolder(url)
    }
  }

  async loadFolder(url) {
      WARN(`TODO-- [load folder] ${url}`)
  }
}

export { SavePageImageDialog }


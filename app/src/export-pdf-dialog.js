import { dialog } from './dialog.js'
import { file } from './file.js'
import { locale } from './locale.js'
import { Finder } from './finder.js'

////////////////////////////////////////////////////////////////

class ExportPDFDialog {
  constructor() {
    this.id = 'export-pdf-dialog'
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
        <div>
          save page image dialog
        </div>`)
      

      $(this.element).html(`<form id='export-pdf'>${string}</form>`)
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
    })
  }
}

export { ExportPDFDialog }


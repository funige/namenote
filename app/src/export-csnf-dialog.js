import { dialog } from './dialog.js'
import { file } from './file.js'
import { locale } from './locale.js'

////////////////////////////////////////////////////////////////

class ExportCSNFDialog {
  constructor() {
    this.id = 'export-csnf-dialog'
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
    })
  }
}

export { ExportCSNFDialog }


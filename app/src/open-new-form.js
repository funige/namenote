import { dialog } from './dialog.js'
import { file } from './file.js'
import { locale } from './locale.js'
import { Finder } from './finder.js'
import { Form } from './form.js'

////////////////////////////////////////////////////////////////

class OpenNewForm extends Form {
  constructor() {
    super()
    this.id = 'open-new'
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = () => { resolve(this.saveForm()) }
      buttons[T('Cancel')] = () => { resolve() }

      const string = locale.translateHTML(`
        <div>
          save page image dialog
        </div>`)
      
      $(this.element).html(`<form id='${this.id}'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('Open New'),
        modal: true,
        width: 550,
        buttons: buttons,
        open: () => {
        }
      })
    })
  }

  saveForm() {
  }
}

export { OpenNewForm }


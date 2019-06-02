import { dialog } from './dialog.js'
import { file } from './file.js'
import { locale } from './locale.js'

////////////////////////////////////////////////////////////////

class Form {
  constructor() {
  }

  destructor() {
    this.element = null
  }
  
  onReturnPressed(callback) {
    LOG('this=',this)
    $(this.element).on('keydown', (e) => {
      if (e.keyCode == 13) {
        e.preventDefault()
        callback()
      }
    })
  }

  onresize(e) {
    const height = $(this.element).height()
    $('.form').height(height)
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

export { Form }

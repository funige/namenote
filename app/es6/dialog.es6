'use strict'

import { MessageBox } from './message-box.es6'

class Dialog {
  constructor() {
    this.current = null
  }

  init() {
  }
  
  isOpen() {
    for (const widget of $('.ui-dialog-content')) {
      if ($(widget).dialog('isOpen')) {
	return true
      }
    }
    return false
  }
  
  open(widget, options) {
    if (this.current) this.close()

    this.current = widget
    
    if (!widget.element) {
      const element = document.createElement('div')
      element.id = widget.id
      element.className = 'dialog'
      element.style.top = '0';
      $('body')[0].appendChild(element)
      widget.element = element
    }
    setTimeout(function() {
      $(widget.element).dialog('open')
    }, 200)

    return widget.init(options)
  }

  close() {
    if (!this.current) return

    const widget = this.current
    const element = widget.element
    if (element) {
      $('#' + widget.id).dialog('close')
      element.parentNode.removeChild(element)
    }
    widget.destructor()
    this.current = null
  }

  alert(error) {
    if (error) {
      ERROR(error)
      this.open(new MessageBox(), {
        type: 'error',
        ok: 'Ok',
        message: error,

      }).then(() => {
        this.close()
      })
    } else {
      this.close()
    }
  }
}

const dialog = new Dialog()

export { dialog }

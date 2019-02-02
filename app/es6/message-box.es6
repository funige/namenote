'use strict'

import { namenote } from './namenote.es6'
import { locale } from './locale.es6'
import { dialog } from './dialog.es6'

const headerImage = {
  confirm: './img/checked.png',
  error: './img/exclamation-mark.png',
}

////////////////////////////////////////////////////////////////

class MessageBox {
  constructor() {
    this.id = 'message-box'
    this.element = null
  }

  init(options) {
    options = options || {}

    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[(options.ok || 'Ok')] = () => {
        dialog.close()
        resolve()
      }
      if (options.cancel) {
        buttons[(options.cancel || 'Cancel')] = () => {
          dialog.close()
          reject()
        }
      }
      
      const string = locale.translateHTML(`
        <div class='message-box'><p>
          ${this.getHeader(options)}
          ${this.getMessage(options)}
        </p></div>`
      )
      $(this.element).html(string)
      $(this.element).dialog({
        autoOpen: true,
        position: { my:'center bottom', at:'center center' },
        title: T(options.title) || '',
        modal: true,
        width: options.width || 400,
        buttons: buttons,
      })
    })
  }

  getMessage(options) {
    return options.message || ''
  }
  
  getHeader(options) {
    if (headerImage[options.type]) {
      return `<img src="${headerImage[options.type]}" width="48px" /><br><br>`

    } else {
      return ''
    }
  }
}

const messageBox = new MessageBox()

export { messageBox }

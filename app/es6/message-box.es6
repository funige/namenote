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
  }

  destructor() {
    this.element = null
  }
  
  init(options) {
    options = options || {}

    return new Promise((resolve, reject) => {
      const buttons = {}
      if (options.ok) {
        buttons[T(options.ok || 'Ok')] = (e) => { resolve() }
      }
      if (options.cancel) {
        buttons[T(options.cancel || 'Cancel')] = (e) => { reject() }
      }
      
      const string = locale.translateHTML(`
        <div class='message-box'>
          ${this.getHeader(options)}
          <p>${this.getMessage(options)}</p>
        </div>
        <div class='dialog-message'></div>`)
      
      $(this.element).html(string)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T(options.title || ''),
        modal: true,
        width: options.width || 350,
        buttons: buttons,
      })
    })
  }

  getMessage(options) {
    return T(options.message) || ''
  }
  
  getHeader(options) {
    if (headerImage[options.type]) {
      return `<img src="${headerImage[options.type]}" width="48px"/>`

    } else {
      return ''
    }
  }

  showProgress(message) {
    const div = $(this.element).find('.dialog-message')
    div.html(message)
  }
}

export { MessageBox }

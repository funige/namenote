import { namenote } from './namenote.js'
import { locale } from './locale.js'
import { Form } from './form.js'

const images = {
  confirm: './img/checked.png',
  error: './img/exclamation-mark.png',
}

////////////////////////////////////////////////////////////////

class MessageForm extends Form {
  constructor() {
    super()
    this.id = 'message'
  }

  init(options) {
    options = options || {}

    return new Promise((resolve, reject) => {
      const buttons = {}
      if (options.ok) {
        buttons[T(options.ok || 'Ok')] = (e) => { resolve(true) }
      }
      if (options.cancel) {
        buttons[T(options.cancel || 'Cancel')] = (e) => { resolve(false) }
      }
      
      const string = locale.translateHTML(`
        <div class='form message-box'>
          ${this.getMessageIcon(options)}
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
  
  getMessageIcon(options) {
    if (images[options.type]) {
      return `<img src="${images[options.type]}" width="48px"/>`
    }
    return ''
  }

  showProgress(message) {
    const div = $(this.element).find('.dialog-message')
    div.html(message)
  }
}

export { MessageForm }

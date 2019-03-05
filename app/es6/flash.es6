'use strict'

import { command } from './command.es6'

////////////////////////////////////////////////////////////////

class Flash {
  constructor() {
  }

  save(item, data) {
    const json = JSON.stringify([item, data])
    localStorage.setItem('namenote/flash', json)

    this.removeUnloadWarning()
  }

  load() {
    const json = localStorage.getItem('namenote/flash')
    localStorage.removeItem('namenote/flash')

    WARN('[flash.load()]', json)
    
    if (json) {
      const options = JSON.parse(json)
      command.do(...options)
    }

    this.setUnloadWarning()
  }

  setUnloadWarning() {
    if (this.app) return

    window.onbeforeunload = (e) => {
      return('Your data will be lost.')
    }
  }

  removeUnloadWarning() {
    window.onbeforeunload = null
  }
}

const flash = new Flash()

export { flash }

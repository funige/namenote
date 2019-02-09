'use strict'

import { command } from './command.es6'

////////////////////////////////////////////////////////////////

class Flash {
  constructor() {
  }

  save(item, data) {
    const json = JSON.stringify([item, data])
    localStorage.setItem('namenote/flash', json)
  }

  load() {
    const json = localStorage.getItem('namenote/flash')
    localStorage.removeItem('namenote/flash')

    if (json) {
      const options = JSON.parse(json)
      command.do(...options)
    }
  }
}

const flash = new Flash()

export { flash }

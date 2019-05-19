import { namenote } from './namenote.js'
import { command } from './command.js'

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

    //WARN('flash', json)
    if (json) {
      const options = JSON.parse(json)
      command.do(...options)
    }

    this.setUnloadWarning()
  }

  setUnloadWarning() {
    if (!namenote.app) window.onbeforeunload = (e) => {
      return('Your data will be lost.')
    }
  }

  removeUnloadWarning() {
    if (!namenote.app) window.onbeforeunload = null
  }
}

const flash = new Flash()

export { flash }

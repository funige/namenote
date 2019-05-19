import { namenote } from './namenote.js'

class Title {
  constructor () {
  }

  init() {
    this.set()
  }
  
  set(title) {
    if (!title) {
      title = (namenote.trial) ? `${T('Namenote')} ${T('Trial')}` : T('Namenote')
    }
    if (namenote.app) {
      namenote.app.setTitle(title)
    } else {
      document.title = title
    }
  }
}

const title = new Title()

export { title }

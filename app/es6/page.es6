'use strict'

////////////////////////////////////////////////////////////////

class Page {
  constructor() {
    this.pid = 0
  }

  destructor() {
    log('page destructor', this.pid)
  }
}

export { Page }

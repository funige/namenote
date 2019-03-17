'use strict'

////////////////////////////////////////////////////////////////

class Page {
  constructor(json) {
    this.init(json)
  }

  destructor() {
    log('page destructor', this.pid)
  }

  init(data) {
    this.tmp = $.extend({}, data)
    return this
  }
}

export { Page }

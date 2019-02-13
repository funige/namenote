'use strict'

import { View } from './view.es6'

////////////////////////////////////////////////////////////////

class PageView extends View {
  constructor() {
    super()
  }

  init(element) {
    this.element = element
    this.preventScrollFreeze()
  }
}

const pageView = new PageView()

export { pageView }

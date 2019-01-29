'use strict'

import { View } from './view.es6'

////////////////////////////////////////////////////////////////

class PageView extends View {
  constructor() {
    super()
  }

  init() {
    this.element = $('.page-view')[0]
    this.preventScrollFreeze()
  }
}

const pageView = new PageView()

export { pageView }

'use strict'

import { View } from './view.es6'

////////////////////////////////////////////////////////////////

class TextView extends View {
  constructor() {
    super()
  }

  init(element) {
    this.element = element
    this.preventScrollFreeze()
  }
}

const textView = new TextView()

export { textView }

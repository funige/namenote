'use strict'

import { View } from './view.es6'

////////////////////////////////////////////////////////////////

class TextView extends View {
  constructor(element) {
    super(element)

    this.init(element)
  }

  init(element) {
    this.element = element
    this.preventScrollFreeze()
  }
}

export { TextView }

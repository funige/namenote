'use strict'

import { namenote } from './namenote.es6'
import { View } from './view.es6'

////////////////////////////////////////////////////////////////

class TextView extends View {
  constructor() {
    super()
  }

  init() {
    this.element = $('.text-view')[0]
    this.preventScrollFreeze()
  }
}

const textView = new TextView()

export { textView }

import { View } from './view.js'

////////////////////////////////////////////////////////////////

class TextView extends View {
  constructor(element) {
    super(element)

    this.enableSmoothScroll(element)
    this.init()
  }

  init() {
  }
}

export { TextView }

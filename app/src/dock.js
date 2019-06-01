import { dockTab } from './dock-tab.js'

////////////////////////////////////////////////////////////////

class Dock {
  constructor() {
  }

  init() {
    dockTab.init()
  }
  
  update(value) {
    dockTab.update()
  }
}

const dock = new Dock()

export { dock }

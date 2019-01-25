'use strict'

import { sideBarTab } from './side-bar-tab.es6'

////////////////////////////////////////////////////////////////

class SideBar {
  constructor() {
  }

  init() {
    sideBarTab.init()
  }
  
  update(value) {
    sideBarTab.update()
  }
}

const sideBar = new SideBar()

export { sideBar }

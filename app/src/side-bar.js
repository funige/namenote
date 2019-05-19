import { sideBarTab } from './side-bar-tab.js'

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

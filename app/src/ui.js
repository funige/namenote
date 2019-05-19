import { widget } from './widget.js'
import { divider } from './divider.js'
import { dialog } from './dialog.js'
import { menu } from './menu.js'
import { title } from './title.js'

import { toolBar } from './tool-bar.js'
import { sideBar } from './side-bar.js'

class UI {
  constructor() {
    this.menu = menu
    this.divider = divider
    this.dialog = dialog

    this.toolBar = toolBar
    this.sideBar = sideBar
  }
  
  init() {
    menu.init()
    title.init()
    divider.init()
    dialog.init()

    toolBar.init()
    sideBar.init()

    $('.split-pane').css('opacity', 1)
  }

  update() {
    WARN('[ui update]')
    divider.update()
    
//  toolBar.update()
//  sideBar.update()
  }

}

const ui = new UI()

export { ui }

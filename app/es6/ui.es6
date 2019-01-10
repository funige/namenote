'use strict'

import { widget } from './widget.es6'
import { toolBar } from './tool-bar.es6'
import { sideBar } from './side-bar.es6'
import { dialog } from './dialog.es6'
import { menu } from './menu.es6'

class UI {
  constructor() {
    this.menu = menu
    this.dialog = dialog
    this.toolBar = toolBar
    this.sideBar = sideBar
  }
  
  init() {
    menu.init()
    dialog.init()
    toolBar.init()
    sideBar.init()
    
    $('.split-pane').css('opacity', 1)
  }

  update() {
    toolBar.update()
    sideBar.update()
  }
}

const ui = new UI()

export { ui }

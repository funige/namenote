'use strict'

import { widget } from './widget.es6'
import { divider } from './divider.es6'
import { dialog } from './dialog.es6'
import { menu } from './menu.es6'
import { title } from './title.es6'

import { toolBar } from './tool-bar.es6'
import { sideBar } from './side-bar.es6'

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

//  divider.update()
  }
}

const ui = new UI()

export { ui }

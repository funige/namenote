'use strict'

import { config } from './config.es6'
import { scaleButton } from './scale-button.es6'
import { historyButton } from './history-button.es6'
import { toolButton } from './tool-button.es6'
import { menuButton } from './menu-button.es6'

class ToolBar {
  constructor() {
  }

  init() {
    scaleButton.init()
    historyButton.init()
    toolButton.init()
    menuButton.init()

    this.update()
    this.updateButtons()
  }
  
  updateButtons() {
    scaleButton.update()
    historyButton.update()
    toolButton.update()
    menuButton.update()
  }
  
  update(value) {
    if (value == undefined) value = config.data.toolBar
    config.data.toolBar = value
    config.save()

    $('#tool-bar').css('display', value ? 'block' : 'none')
    $('#main').css('height', value ? 'calc(100% - 37px)' : '100%')
    $('#main').css('top', value ? '37px' : '0')

    //View.onResize()
  }

  toggle() {
    this.update(!config.data.toolBar)
  }
}

const toolBar = new ToolBar();

export { toolBar }

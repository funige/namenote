import { config } from './config.js'
import { viewButton } from './view-button.js'
import { historyButton } from './history-button.js'
import { toolButton } from './tool-button.js'
import { menuButton } from './menu-button.js'

class ToolBar {
  constructor() {
  }

  init() {
    viewButton.init()
    historyButton.init()
    toolButton.init()
    menuButton.init()

    this.update()
    this.updateButtons()
  }
  
  updateButtons() {
    viewButton.update()
    historyButton.update()
    toolButton.update()
    menuButton.update()
  }
  
  update(value) {
    if (value == undefined) value = config.data.toolBar
    config.data.toolBar = value
    config.save()

    $('#header').css('display', value ? 'block' : 'none')
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

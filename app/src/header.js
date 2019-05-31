import { config } from './config.js'
import { viewButton } from './view-button.js'
import { historyButton } from './history-button.js'
import { toolButton } from './tool-button.js'
import { menuButton } from './menu-button.js'

class Header {
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
    if (!value) value = config.data.header || true
    config.data.header = value
    config.save()

    $('#header').css('display', value ? 'block' : 'none')
    $('#main').css('height', value ? 'calc(100% - 37px)' : '100%')
    $('#main').css('top', value ? '37px' : '0')
  }

  toggle() {
    this.update(!config.data.header)
  }
}

const header = new Header();

export { header }

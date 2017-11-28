'use strict'

import { config } from './config.es6'
import { View } from './view.es6'
import { History } from './history.es6'

import { toolButton } from './tool-button.es6'
import { historyButton } from './history-button.es6'
import { maskButton } from './mask-button.es6'
import { scaleButton } from './scale-button.es6'
import { menuButton } from './menu-button.es6'


const toolBar = {}

toolBar.init = () => {
  toolButton.init()
  historyButton.init()
  //maskButton.init()
  scaleButton.init()
  menuButton.init()

  toolBar.update()
  toolBar.updateButtons()
}

toolBar.updateButtons = () => {
  toolButton.update()
  historyButton.update()
  maskButton.update()
  scaleButton.update()
  menuButton.update()
}

toolBar.update = (value) => {
  if (value === undefined) value = config.data.toolBar
  config.data.toolBar = value
  config.save()

  $('#tool-bar').css('display', value ? 'block' : 'none')
  $('#main').css('height', value ? 'calc(100% - 37px)' : '100%')
  $('#main').css('top', value ? '37px' : '0')
  View.onResize()
}

toolBar.toggle = () => {
  toolBar.update(!config.data.toolBar)
}
  
export { toolBar }

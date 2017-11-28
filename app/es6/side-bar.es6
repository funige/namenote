'use strict'

import { config } from './config.es6'
import { View } from './view.es6'


const sideBar = {
  init: () => {
    $('.split-pane').splitPane()
    $('.split-pane').on('dividerdragend', (e) => { // or 'splitpaneresize'
      sideBar.onDividerDragEnd()
    })

    sideBar.update()
  },

  update: (value) => {
    if (value === undefined) value = config.data.sideBar
    config.data.sideBar = value
    config.save()

    const size = config.data.sideBarSize
    $('.split-pane').splitPane('firstComponentSize', value ? size : 0)
    View.onResize();
  },

  toggle: () => {
    sideBar.update(!config.data.sideBar)
  },
  
  onDividerDragEnd: () => {
    const size = $('#left-component').width()
    if (size > 0) {
      config.data.sideBarSize = size
      namenote.ui.sideBar.update(true)
    } else {
      namenote.ui.sideBar.update(false)
    }
  },
}


export { sideBar }

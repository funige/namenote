'use strict'

import { config } from './config.es6'
import { viewButton } from './view-button.es6'

let minWidth = 180

////////////////////////////////////////////////////////////////

class Divider {
  constructor() {
  }

  init() {
    $('.split-pane').splitPane()
    $('.split-pane').on('dividerdragend', (e) => { // or 'splitpaneresize'
      this.onDividerDragEnd()
    })
    this.setPosition()
  }

  update(value) {
    LOG('[update]')
    
    if (value == undefined) value = config.data.sideBar
    config.data.sideBar = value
    config.save()

    let width = (value) ? config.data.sideBarWidth : 0
    if (config.data.sideBarPosition == 'right') {
      width = $('.split-pane').width() - width + 1
    }

    if (value) {
      const maxWidth = $('.split-pane').width() - minWidth - 1
      if (width < minWidth) width = minWidth
      if (width > maxWidth) width = maxWidth
    }

    $('.split-pane').splitPane('firstComponentSize', width)
    viewButton.update()
  }

  toggle() {
    this.update(!config.data.sideBar)
  }

  setPosition(value) {
    if (value == undefined) value = config.data.sideBarPosition
    config.data.sideBarPosition = value
    config.save()

    const mainView = $('.main-view')
    const sideBar = $('.sidebar')

    if (value == 'left') {
      $('#left-component').append(sideBar)
      $('#right-component').append(mainView)

    } else {
      $('#right-component').append(sideBar)
      $('#left-component').append(mainView)
    }
    this.update()
  }
  
  onDividerDragEnd() {
    LOG("[divider drag end]")
    let width = $('.sidebar').width()

    const maxWidth = $('.split-pane').width() - minWidth - 1
    if (width < minWidth) width = minWidth
    if (width > maxWidth) width = maxWidth

    config.data.sideBarWidth = parseInt(width)
    config.data.sideBar = true
    config.save()
    this.update()
  }
}

const divider = new Divider()

export { divider }

'use strict'

import { config } from './config.es6'

let minWidth = 150

////////////////////////////////////////////////////////////////

class SideBar {
  constructor() {
  }

  init() {
    $('.split-pane').splitPane()
    $('.split-pane').on('dividerdragend', (e) => { // or 'splitpaneresize'
      this.onDividerDragEnd()
    })
    this.updatePosition()
  }
  
  update(value) {
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
  }

  toggle() {
    this.update(!config.data.sideBar)
  }

  updatePosition(value) {
    if (value == undefined) value = config.data.sideBarPosition
    config.data.sideBarPosition = value
    config.save()

    const mainView = $('.main-view')
    const sideBar = $('.side-bar')

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
    let width = $('.side-bar').width()

    const maxWidth = $('.split-pane').width() - minWidth - 1
    if (width < minWidth) width = minWidth
    if (width > maxWidth) width = maxWidth

    config.data.sideBarWidth = parseInt(width)
    config.data.sideBar = true
    config.save()
    this.update()
  }
}

const sideBar = new SideBar()

export { sideBar }

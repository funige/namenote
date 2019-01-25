'use strict'

import { command } from './command.es6'
import { projectManager } from './project-manager.es6'

let quickZoomButton
let zoomButton
let unzoomButton

let sidebarButton

////////////////////////////////////////////////////////////////

class ScaleButton {
  constructor() {
  }

  init() {
    quickZoomButton = $('#row-button').imageButton({
      src: 'img/magnifier-button.png',
      float: 'right',
      click: function(e) { command.quickZoom() }
    })[0]

    zoomButton = $('#zoom-button').imageButton({
      src: 'img/zoom-button.png',
      disabled: true,
      float: 'right',
      click: function(e) { command.zoom() }
    })[0]

    unzoomButton = $('#unzoom-button').imageButton({
      src: 'img/unzoom-button.png',
      disabled: true,
      float: 'right',
      click: function(e) { command.unzoom() }
    })[0]
    
    sidebarButton = $('#sidebar-button').imageButton({
      src: 'img/unzoom-button.png',
      disabled: true,
      float: 'right',
      click: function(e) { command.sideBar() }
    })[0]
  }

  update() {
    const project = projectManager.current
    const quickZoom = (project) ? project.view.quickZoom : false
    
    $(quickZoomButton).imageButton('locked', quickZoom)
    $(zoomButton).imageButton('disabled', !project)
    $(unzoomButton).imageButton('disabled', !quickZoom)
  }
}

const scaleButton = new ScaleButton()

export { scaleButton }

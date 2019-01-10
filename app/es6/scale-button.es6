'use strict'

import { command } from './command.es6'
import { projectManager } from './project-manager.es6'

let quickZoomButton
let zoomButton
let unzoomButton

////////////////////////////////////////////////////////////////

class ScaleButton {
  constructor() {
  }

  init() {
    quickZoomButton = $('#row-button').imgButton({
      src: 'img/magnifier-button.png',
      float: 'right',
      click: function(e) { command.quickZoom() }
    })[0]

    zoomButton = $('#zoom-button').imgButton({
      src: 'img/zoom-button.png',
      disabled: true,
      float: 'right',
      click: function(e) { command.zoom() }
    })[0]

    unzoomButton = $('#unzoom-button').imgButton({
      src: 'img/unzoom-button.png',
      disabled: true,
      float: 'right',
      click: function(e) { command.unzoom() }
    })[0]
  }

  update() {
    const project = projectManager.current
    const quickZoom = (project) ? project.view.quickZoom : false
    
    $(quickZoomButton).imgButton('locked', quickZoom)
    $(zoomButton).imgButton('disabled', !project)
    $(unzoomButton).imgButton('disabled', !quickZoom)
  }
}

const scaleButton = new ScaleButton()

export { scaleButton }

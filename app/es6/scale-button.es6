'use strict'

import { Project } from './project.es6'
import { command } from './command.es6'

let quickZoomButton
let zoomButton
let unzoomButton


const scaleButton = {}

scaleButton.init = () => {
  quickZoomButton = $('#row-button').imgButton({
    src: 'img/magnifier-button.png',
    float: 'right',
    click: function(e) {
      command.quickZoom()
    }
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

scaleButton.update = () => {
  const project = Project.current

  const quickZoom = (project) ? project.view.quickZoom : false
  $(quickZoomButton).imgButton('locked', quickZoom)
  $(zoomButton).imgButton('disabled', !project)
  $(unzoomButton).imgButton('disabled', !quickZoom)
}

export { scaleButton }

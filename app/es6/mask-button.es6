'use strict'

import { Project } from './project.es6'

let canvasMaskButton
let textMaskButton


const maskButton = {}

maskButton.init = () => {
  canvasMaskButton = $('#canvas-mask-button').imgButton({
    src: 'img/marquee-button.png',
    disabled: true,
    float: 'right',
    click: function(e) {
      const project = Project.current
      if (!project) return

      const c = project.bookmark
      c.canvasMask = !c.canvasMask
      if (c.canvasMask && c.textMask) c.textMask = false
      maskButton.update()
    }
  })[0]

  textMaskButton = $('#text-mask-button').imgButton({
    src: 'img/marquee-button.png',
    disabled: true,
    float: 'right',
    click: function(e) {
      const project = Project.current
      if (!project) return

      const c = project.bookmark
      c.textMask = !c.textMask
      if (c.textMask && c.canvasMask) c.canvasMask = false
      maskButton.update()
    }
  })[0]
}

maskButton.update = () => {
  const project = Project.current
  $(canvasMaskButton).imgButton('disabled', project ? false : true)
  $(textMaskButton).imgButton('disabled', project ? false : true)

  if (project) {
    const c = project.bookmark
    const canvasMask = (project) ? c.canvasMask : false
    const textMask = (project) ? c.textMask : false
    $(canvasMaskButton).imgButton('locked', canvasMask)
    $(textMaskButton).imgButton('locked', textMask)
  }
}


export { maskButton }

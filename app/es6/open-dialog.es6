'use strict'

import { namenote } from './namenote.es6'
import { locale } from './locale.es6'
import { dialog } from './dialog.es6'

import { projectManager } from './project-manager.es6'
import { FileView } from './file-view.es6'

////////////////////////////////////////////////////////////////

class OpenDialog {
  constructor() {
    this.id = 'open-dialog'
  }

  destructor() {
    this.fileView.destructor()
    this.element = null
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = () => { resolve(this.fileView.project) }
      buttons[T('Cancel')] = () => { resolve() }

      
      const string = locale.translateHTML(`<div class='file-view' style='margin-top:5px; height:400px;'></div>`)
      
      $(this.element).html(`<form id='open'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('Open'),
        modal: true,
        width: 550,
        buttons: buttons,
        open: () => {
          $(this.element).find('.folders').focus()
        }
      })

      this.fileView = new FileView($(this.element).find('.file-view')[0], this)
    })
  }

  enable() {
    $(this.element).parent()
      .find('.ui-dialog-buttonpane button:first')
      .button('enable')
  }

  disable() {
    $(this.element).parent()
      .find('.ui-dialog-buttonpane button:first')
      .button('disable')
  }
}

export { OpenDialog }



//    $('.ui-dialog-buttonpane button:last').css('float', 'left') //てすと

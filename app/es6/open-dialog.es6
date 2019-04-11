'use strict'

import { namenote } from './namenote.es6'
import { locale } from './locale.es6'
import { dialog } from './dialog.es6'

////////////////////////////////////////////////////////////////

class OpenDialog {
  constructor() {
    this.id = 'open-dialog'
  }

  destructor() {
    this.element = null
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = () => { LOG('ok!'); resolve() }
      buttons[T('Cancel')] = () => { LOG('cancel!'); resolve() }

      const string = locale.translateHTML(`
        [open dialog]
      `)

      $(this.element).html(`<form id='open'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('Open'),
        modal: true,
        width: 550,
        button: buttons,
      })
    })
  }

  saveParams() {}
}

export { OpenDialog }



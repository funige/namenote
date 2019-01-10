'use strict'

import { namenote } from './namenote.es6'
import { locale } from './locale.es6'
import { dialog } from './dialog.es6'

class AboutDialog {
  constructor() {
    this.id = 'about-dialog'
    this.element = null
  }

  init(version) {
    $('#about-dialog').dialog({
      autoOpen: true,
      position: { my:'center bottom', at:'center center' },
      title: T('About Namenote'),
      modal: true,
      width: 600,
      buttons: { Ok: this.ok },
    })

    const string = locale.translateHTML(`
    <center>
      <img src='./img/namenote1024.png' width="100px" />
      <br>
      Namenote v${namenote.version}
      <br><br>
      <small>Copyright (c) Funige</small></center>`
    )
    
    $('#about-dialog').html(string)
  }

  ok() {
    dialog.close()
    return false
  }
}

const aboutDialog = new AboutDialog()

export { aboutDialog }

'use strict'

import { namenote } from './namenote.es6'
import { locale } from './locale.es6'
import { dialog } from './dialog.es6'

////////////////////////////////////////////////////////////////

class AboutDialog {
  constructor() {
    this.id = 'about-dialog'
    this.element = null
  }

  init(version) {
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = resolve
    
      const string = locale.translateHTML(`
        <center>
          <img src='./img/namenote1024.png' width="100px" />
          <br>
          Namenote v${namenote.version}
          <br><br>
          <small>Copyright (c) Funige</small>
<br>
<br>
<p>
<style>
</style>

<label for='hoge'>hogehoge...
<select name='hoge' id='hoge'>
<option>Hoge<p>Hoge2</option>
<option>Foge</option>
<option>Gege</option>
</select>
</label>


    <label for="salutation">Select a title</label>
    <select name="salutation" id="salutation">
      <option disabled selected>Please pick one</option>
      <option>Mr.</option>
      <option>Mrs.</option>
      <option>Dr.</option>
      <option>Prof.</option>
      <option>Other</option>
    </select></p>
        </center>`)

      $(this.element).html(string)
      $(this.element).dialog({
        autoOpen: false,
        open: function() {
        },
        position: { my:'center center', at:'center center' },
        title: T('About Namenote'),
        modal: true,
        width: 360,
        buttons: buttons,
      })

      $('#hoge').selectmenu()
      $('#salutation').selectmenu()

    })
  }
}

const aboutDialog = new AboutDialog()

export { aboutDialog }

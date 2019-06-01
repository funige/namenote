import { namenote } from './namenote.js'
import { locale } from './locale.js'
import { dialog } from './dialog.js'

////////////////////////////////////////////////////////////////

class AboutDialog {
  constructor() {
    this.id = 'about-dialog'
  }

  destructor() {
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

export { AboutDialog }
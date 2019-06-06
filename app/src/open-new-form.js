import { dialog } from './dialog.js'
import { file } from './file.js'
import { locale } from './locale.js'
import { Finder } from './finder.js'
import { Form } from './form.js'

////////////////////////////////////////////////////////////////

class OpenNewForm extends Form{
  constructor() {
    super()
    this.id = 'open-new'
  }

  
  init() {
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = () => { resolve(this.saevForm()) }
      buttons[T('Cancel')] = () => { resolve() }

      const string = locale.translateHTML(`
        <div class='form' style='height:400px;'>
          <div style='height:80px;'>
            名前: <input class='filename' type='text' />
            <br/>
            場所: <select class='folders'></select>
                  <div class='toggle-button'></div>
          </div>
          <ul class='file-list' style='position: relative; height: calc(100% - 80px);'></ul>

          <br>
          <table>
            <tr><td>T(Number of pages):
              <td><input name='count' class='count' type='text' value=8 /><br>

            <tr><td style='height: 1em;'>
            <tr><td>T(Template):
	      <td><select name='tmpl' class='tmpl'>
	        <option value='Manga'>T(Manga)</select>

            <tr><td>T(Binding point):
              <td><label><input name='bind' type='radio' value=0>T(Left binding)</label>
              <label><input name='bind' type='radio' checked value=1>T(Right binding)</label>

            <tr><td>T(Start page):
              <td><label><input name='start' type='radio' value=0 checked>T(From left)</label>
	      <label><input name='start' type='radio' value=1>T(From right)</label>

              <input type='submit' style='display: none' />
          </table>
        </div>
`)
      
      $(this.element).html(`<form id='${this.id}'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('New'),
        modal: true,
        width: 550,
        buttons: buttons,
        open: () => {
          this.onReturnPressed(() => {
            LOG('enter pressed')
            resolve(this.saveForm())
          })
        }
      })

      const folders = this.element.querySelector('.folders')
      const fileList = this.element.querySelector('.file-list')
      const toggleButton = this.element.querySelector('.toggle-button')
      this.finder = new Finder(folders, fileList, toggleButton, {
        autoOpen: false,
        height: 'calc(100% - 80px)',
        noRecents: true,
        selected: (url) => {
          this.load(url)
        },
      })

      this.initForm()
      this.load(file.getHome())
    })
  }

  async load(url) {
    const projectURL = await file.getProjectURL(url)
    if (projectURL) {
      alert(T('Folder open error.'))

    } else {
      this.finder.loadFolder(url)
    }
  }

  initForm() {
    const filename = `${Date.now()}.png`
    $(this.element).find('input.filename')
      .val(filename)
      .on('keyup', (e) => {
        (e.target.value) ? this.enable() : this.disable()
      })
  }
  
  saveForm() {
    const filename = $(this.element).find('input.filename').val()
    const result = `${this.finder.url}${filename}`
    this.result = result
    return result
  }
}

export { OpenNewForm }

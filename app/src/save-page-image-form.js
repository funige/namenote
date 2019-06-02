import { dialog } from './dialog.js'
import { file } from './file.js'
import { locale } from './locale.js'
import { Finder } from './finder.js'
import { Form } from './form.js'

////////////////////////////////////////////////////////////////

class SavePageImageForm extends Form {
  constructor() {
    super()
    this.id = 'save-page-image-form'
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {}
      buttons[T('Ok')] = () => { resolve(this.saveForm()) }
      buttons[T('Cancel')] = () => { resolve() }

      const string = locale.translateHTML(`
        <div class='form' style='height:400px;'>
          <div style='height:80px;'>
            名前: <input class='filename' type='text' />
            <br/>
            場所: <select class='folders'></select>
          </div>
          <ul class='file-list' style='height: calc(100% - 80px);'></ul>
        </div>`)

      $(this.element).html(`<form id='save-page-image'>${string}</form>`)
      $(this.element).dialog({
        autoOpen: false,
        position: { my:'center center', at:'center center' },
        title: T('Save Image'),
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

      const folders = $(this.element).find('.folders')[0]
      const fileList = $(this.element).find('.file-list')[0]
      this.finder = new Finder(folders, fileList, {
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

export { SavePageImageForm }


import { file } from './file.js';
import { locale, T } from './locale.js';
import { Finder } from './finder.js';
import { Form } from './form.js';

// //////////////////////////////////////////////////////////////

class ExportCSNFForm extends Form {
  constructor(project) {
    super();
    this.id = 'export-csnf';
    this.project = project;
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {};
      buttons[T('Ok')] = () => { resolve(this.saveForm()); };
      buttons[T('Cancel')] = () => { resolve(); };

      const string = locale.translateHTML(`
        <div class='form' style='height:400px;'>
          <div style='height:80px;'>
            名前: <input class='filename' type='text' />
            <br/>
            場所: <select class='folders'></select>
                  <div class='toggle-button' style='display:none;'></div>
          </div>
          <ul class='file-list' style='height: calc(100% - 80px);'></ul>
        </div>
        <input type='submit' style='display: none' />`);

      $(this.element).html(`<form id='${this.id}'>${string}</form>`);
      $(this.element).dialog({
        autoOpen: false,
        position: { my: 'center center', at: 'center center' },
        title: T('Export CLIP STUDIO Storyboard'),
        modal: true,
        width: 375,
        buttons: buttons,
        open: () => {
          this.onReturnPressed(() => {
            console.log('enter pressed');
            resolve(this.saveForm());
          });
        }
      });

      const folders = this.element.querySelector('.folders');
      const fileList = this.element.querySelector('.file-list');
      this.finder = new Finder(folders, fileList, null, {
        noRecents: true,
        selected: (url) => {
          this.load(url);
        }
      });

      this.load(file.getHome('export'), {
        loaded: () => {
          this.initForm();
        }
      });
    });
  }

  async initForm() {
    const name = file.truncateURL(this.project.url) + '.csnf';
    const saveName = await file.getSaveName(name, this.finder.url);
    $(this.element).find('input.filename')
      .val(saveName)
      .select()
      .on('keyup', (e) => {
        (e.target.value) ? this.enable() : this.disable();
      });
  }

  saveForm() {
    const saveName = $(this.element).find('input.filename').val();
    const result = `${this.finder.url}${saveName}`;
    this.result = result;
    console.log(result);
    return result;
  }
}

export { ExportCSNFForm };

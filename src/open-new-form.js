import { file } from './file.js';
import { locale, T } from './locale.js';
import { Finder } from './finder.js';
import { Form } from './form.js';

// //////////////////////////////////////////////////////////////

class OpenNewForm extends Form {
  constructor() {
    super();
    this.id = 'open-new';
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
                  <div class='toggle-button'></div>
          </div>
          <ul class='file-list' style='position: relative; height: calc(100% - 80px);'></ul>

          <br>
          <table>
            <tr><td>T(Number of pages):
              <td><input name='count' class='count' type='text' value=8 /><br>

            <tr><td>T(Template):
              <td><select name='tmpl' class='tmpl'>
                <option value='Manga'>T(Manga)</select>

            <tr><td style='height: 1em;'>

            <tr><td>T(Binding point):<td>
              <label><input name='bind' type='radio' value=0>T(Left binding)</label>
              <label><input name='bind' type='radio' checked value=1>T(Right binding)</label>
            <tr><td>T(Start page):<td>
              <label><input name='start' type='radio' value=0 checked>T(From left)</label>
	      <label><input name='start' type='radio' value=1>T(From right)</label>
          </table>
          <input type='submit' style='display: none' />
        </div>`);

      $(this.element).html(`<form id='${this.id}'>${string}</form>`);
      $(this.element).dialog({
        autoOpen: false,
        position: { my: 'center center', at: 'center center' },
        title: T('New'),
        modal: true,
        width: 550,
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
      const toggleButton = this.element.querySelector('.toggle-button');
      this.finder = new Finder(folders, fileList, toggleButton, {
        autoOpen: false,
        height: 'calc(100% - 80px)',
        noRecents: true,
        selected: (url) => {
          this.load(url);
        }
      });

      const tmpl = this.element.querySelector('.tmpl');
      $(tmpl).iconselectmenu({});

      this.load(file.getHome('note'), {
        loaded: () => {
          this.initForm();
        }
      });
    });
  }

  async initForm() {
    const name = T('Untitled');
    const saveName = await file.getSaveName(name, this.finder.url);
    $(this.element).find('input.filename')
      .val(saveName)
      .select()
      .on('keyup', (e) => {
        (e.target.value) ? this.enable() : this.disable();
      });
  }

  saveForm() {
    const filename = $(this.element).find('input.filename').val();
    const count = $(this.element).find('input.count').val();
    const start = document.forms[this.id].start.value == '1';
    const bind = document.forms[this.id].bind.value == '1';

    return {
      path: this.finder.url,
      name: filename,
      page_count: count,
      bind_right: bind,
      startpage_right: start
    };
  }
}

export { OpenNewForm };

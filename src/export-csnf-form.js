import { file } from './file.js';
import { locale, T } from './locale.js';
import { Finder } from './finder.js';
import { Form } from './form.js';

// //////////////////////////////////////////////////////////////

class ExportCSNFForm extends Form {
  constructor() {
    super();
    this.id = 'export-csnf';
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {};
      buttons[T('Ok')] = () => { resolve(true); };
      buttons[T('Cancel')] = () => { resolve(); };

      const string = locale.translateHTML(`
        <div class='form'>
          save page image dialog
        </div>`);


      $(this.element).html(`<form id='${this.id}'>${string}</form>`);
      $(this.element).dialog({
        autoOpen: false,
        position: { my: 'center center', at: 'center center' },
        title: T('Export CSNF'),
        modal: true,
        width: 550,
        buttons: buttons,
        open: () => {
        }
      });
    });
  }
}

export { ExportCSNFForm };

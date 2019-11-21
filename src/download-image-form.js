import { file } from './file.js';
import { locale, T } from './locale.js';
import { Form } from './form.js';
import { svgRenderer } from './svg-renderer.js';

class DownloadImageForm extends Form {
  constructor(page) {
    super();
    this.id = 'download-image';
    this.page = page;
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {};
      //buttons[T('Ok')] = () => { resolve(this.saveForm()); };
      buttons[T('Cancel')] = () => { resolve(); };

      const string = locale.translateHTML(`
        <div class='form'>
          [preview]
        </div>
        <input type='submit' style='display: none' />`);

      svgRenderer.capture(this.page, (png) => {
        console.warn('Captured:', png);
        if (png) {
          $(this.element).html(`<form id='${this.id}'>${string}</form>`);
          $(this.element).dialog({
            autoOpen: false,
            position: { my: 'center center', at: 'center center' },
            title: T('Download Image'),
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
          this.initForm();
          this.showDownload(png, `${Date.now()}.png`);

        } else {
          resolve();
        }
      });

    });
  }

  initForm() {
  }

  saveForm() {
    return null;
  }
}

export { DownloadImageForm };

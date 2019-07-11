import { namenote } from './namenote.js';
import { locale, T } from './locale.js';
import { Form } from './form.js';

// //////////////////////////////////////////////////////////////

class AboutForm extends Form {
  constructor() {
    super();
    this.id = 'about';
  }

  init() {
    return new Promise((resolve) => {
      const buttons = {};
      buttons[T('Ok')] = resolve;

      const string = locale.translateHTML(`
        <center>
          <img src='./img/namenote2.png' width="100px" />
          <br>
          Namenote v${namenote.version}
          <br>
          <small>Copyright (c) Funige</small>
        </center>`);

      $(this.element).html(string);
      $(this.element).dialog({
        autoOpen: false,
        open: () => {
        },
        position: { my: 'center center', at: 'center center' },
        title: T('About Namenote'),
        modal: true,
        width: 360,
        buttons: buttons
      });
    });
  }
}

export { AboutForm };

import { dialog } from './dialog.js';
import { file } from './file.js';
import { locale, T } from './locale.js';

// //////////////////////////////////////////////////////////////

class Form {
  constructor() {
  }

  destructor() {
    this.element = null;
  }

  async load(url, options = {}) {
    console.log('form load', url);

    const projectURL = await file.getProjectURL(url);
    if (projectURL) {
      alert(T('Folder open error.'));
    } else {
      this.finder.loadFolder(url, options);
    }
  }

  log(text) {
    const footer = $(this.element).parent().find('.ui-dialog-buttonset');
    if (!footer.find('.message').length > 0) {
      $('<div>').addClass('message').appendTo(footer);
    }
    footer.find('.message').html(text);
  }

  onReturnPressed(callback) {
    $(this.element).on('keydown', (e) => {
      if (e.keyCode == 13) {
        console.log('onreturnpressed');
        e.preventDefault();
        callback();
      }
    });
  }

  onresize(e) {
    const height = $(this.element).height();
    $('.form').height(height);
  }

  enable() {
    $(this.element).parent()
      .find('.ui-dialog-buttonpane button:first')
      .button('enable');
  }

  disable() {
    $(this.element).parent()
      .find('.ui-dialog-buttonpane button:first')
      .button('disable');
  }
}

export { Form };

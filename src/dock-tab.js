import { command } from './command.js';
import { T } from './locale.js';


class DockTab {
  constructor() {
    this.buttons = [];
  }

  init() {
    $('.sidebar .thin-toolbar').on('dblclick', (e) => {
      console.log('dblclick sidebar');
    });

    const textButton = $('#text-view-button').textButton({
      text: T('Texts'),
      locked: true,
      click: (e) => {
        if ($(e.target).textButton('instance')) {
          command.showTextView();
        }
      },
      dblclick: (e) => {
        console.log('dblclick text tab');
      }
    })[0];

    const pageButton = $('#page-view-button').textButton({
      text: T('Pages'),
      click: (e) => {
        if ($(e.target).textButton('instance')) {
          command.showPageView();
        }
      },
      dblclick: (e) => {
        console.log('dblclick page tab');
      }
    })[0];

    const noteButton = $('#note-view-button').textButton({
      text: T('Notes'),
      click: (e) => {
        if ($(e.target).textButton('instance')) {
          command.showNoteView();
        }
      },
      dblclick: (e) => {
        console.log('dblclick note tab');
      }
    })[0];

    this.buttons.push(textButton, pageButton, noteButton);
  }

  update() {
  }

  select(name) {
    for (const button of this.buttons) {
      const locked = $(button).textButton('locked');

      if (button && button.id.indexOf(name) == 0) {
        if (!locked) {
          $(button).textButton('locked', true);
        }
      } else if (locked) {
        $(button).textButton('locked', false);
      }
    }
  }
}

const dockTab = new DockTab();

export { dockTab };

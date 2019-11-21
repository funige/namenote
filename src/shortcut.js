import { shortcutDefault } from './shortcut-default.js';
import { command } from './command.js';
import { dialog } from './dialog.js';
import { pointer } from './pointer.js';
const Mousetrap = require('mousetrap');

class Shortcut {
  constructor() {
    this.data = [];

    Mousetrap.addKeycodes({
      107: 'numplus',
      109: 'numminus',
      110: 'num.',
      111: 'num/',
      106: 'num*'
    });

    Mousetrap.prototype.stopCallback = function (e, element, combo) {
      if (pointer.isEditable(element)) {
        console.log('keycode=', e.keyCode, e);

        if (e.ctrlKey && !e.shiftKey && !e.metaKey) {
          switch (e.keyCode) {
            case 71: // ctrl+g
            case 188: // ctrl+,
            case 190: // ctrl+.
            case 221: // ctrl+]
              return false;

            default:
              break;
          }
        }

        if (e.keyCode === 9) { // TAB
          return false;
        }
        return true;
      }
      return false;
    };
  }

  load() {
    const json = localStorage.getItem('namenote/shortcut');
    this.data = json ? JSON.parse(json) : Object.assign({}, shortcutDefault);
    const data = Object.assign({}, shortcutDefault);
    this.bind();
  }

  save() {
    const json = JSON.stringify(this.data);
    localStorage.setItem('namenote/shortcut', json);
  }

  resetStorage() {
    this.data = Object.assign({}, shortcutDefault);
    this.save();

    Mousetrap.reset();
    this.bind();
  }

  bind() {
    for (let item in this.data) {
      const key = this.data[item];
      const handler = command[item];

      if (item !== 'developerTools') {
        if (handler) {
          console.log(`'${item}`);

          Mousetrap.bind(key, (e) => {
            command.prev = command.current;
            command.current = item;

            if (!dialog.isOpen()) {
              console.log(`*${item}*`);
              handler();
            }
            return false;
            // return (dialog.isOpen()) ? true : false
          }, 'keydown');
        } else {
          console.log(`'${item}': no such command`);
        }
      }
    }

    Mousetrap.bind('space', (e) => {
      pointer.clearMove()
      return false;
    })

    Mousetrap.bind('enter', (e) => {
      if (dialog.isOpen()) return true
      //command.quickZoom()
      console.log('[quick zoom on enter]');
      return false
    })

    Mousetrap.bind('space', (e) => {
      if (!pointer.isMoved()) {
        //command.quickZoom();
        console.log('[quick zoom on space]');
      }
      return false;
    }, 'keyup')
  }
}

const shortcut = new Shortcut();

export { shortcut };

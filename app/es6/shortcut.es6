'use strict'

import { command } from './command.es6'
import { shortcutDefault } from './shortcut-default.es6'
import { Text } from './text.es6'
import { Controller } from './controller.es6'



const shortcut = {
  data: [],

  init: () => {
    Mousetrap.addKeycodes({
      107: 'numplus',
      109: 'numminus',
      110: 'num.',
      111: 'num/',
      106: 'num*',
    })

    Mousetrap.prototype.stopCallback = function(e, element, combo) {
      if (Text.isEditable(element)) {
	nn.log('keycode=', e.keyCode, e)

	if (e.ctrlKey && !e.shiftKey && !e.metaKey) {
	  switch (e.keyCode) {
	  case 71:  // ctrl+g
	  case 188: // ctrl+,
	  case 190: // ctrl+.
	  case 221: // ctrl+]
	    return false
	  }
	}
	return true
      }
      return false
    }
    shortcut.load()
  },
  
  load: () => {
    const json = localStorage.getItem('namenote/shortcut')
    shortcut.data = json ? JSON.parse(json) : Object.assign({}, shortcutDefault)
    shortcut.bind();
  },

  save: () => {
    const json = JSON.stringify(shortcut.data)
    localStorage.setItem('namenote/shortcut', json)
  },
  
  reset: () => {
    shortcut.data = Object.assign({}, shortcutDefault)
    shortcut.save()

    Mousetrap.reset()
    shortcut.bind()
  },

  bind: () => {
    for (let item in shortcut.data) {
      const key = shortcut.data[item]
      const handler = command[item]

      if (!namenote.isApp) {
	if (item == 'developerTools') continue
      }

      if (handler) {
	Mousetrap.bind(key, (e) => {
	  command.prev = command.current
	  command.current = item
	  nn.log(`*${item}*`)
	  handler()
	  return false;
	}, 'keydown')
//	}) //keydownにすると2ストロークコマンドと干渉する

      } else {
	nn.log(`'${item}': no such command`)
      }
    }

    Mousetrap.bind('space', (e) => {
      Controller.clearMove()
      return false;
    })
    Mousetrap.bind('enter', (e) => {
      Controller.clearMove()
      return false;
    })

    Mousetrap.bind('space', (e) => {
      if (!Controller.isMoved()) {
	command.quickZoom();
      }
      return false;
    }, 'keyup')
    Mousetrap.bind('enter', (e) => {
      if (!Controller.isMoved()) {
	command.quickZoom();
      }
      return false;
    }, 'keyup')
  },
}



export { shortcut }

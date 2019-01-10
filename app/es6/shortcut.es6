'use strict'

//import { namenote } from './namenote.es6'
import { shortcutDefault } from './shortcut-default.es6'
import { command } from './command.es6'

/*
import { Text } from './text.es6'
import { Controller } from './controller.es6'
*/

import { ui } from './ui.es6'

class Shortcut {
  constructor() {
    this.data = []

    Mousetrap.addKeycodes({
      107: 'numplus',
      109: 'numminus',
      110: 'num.',
      111: 'num/',
      106: 'num*',
    })

    Mousetrap.prototype.stopCallback = function(e, element, combo) {
/*
      if (Text.isEditable(element)) {
        log('keycode=', e.keyCode, e)

	if (e.ctrlKey && !e.shiftKey && !e.metaKey) {
	  switch (e.keyCode) {
	  case 71:  // ctrl+g
	  case 188: // ctrl+,
	  case 190: // ctrl+.
	  case 221: // ctrl+]
	    return false
	  }
	}

	if (e.keyCode == 9) { // TAB
	  return false
	}
	return true
      }
      return false
*/
    }
  }

  load() {
    const json = localStorage.getItem('namenote/shortcut')
    this.data = json ? JSON.parse(json) : Object.assign({}, shortcutDefault)
    this.bind()
  }

  save() {
    const json = JSON.stringify(this.data)
    localStorage.setItem('namenote/shortcut', json)
  }
  
  resetStorage() {
    this.data = Object.assign({}, shortcutDefault)
    this.save()

    Mousetrap.reset()
    this.bind()
  }

  bind() {
    for (let item in this.data) {
      const key = this.data[item]
      const handler = command[item]

      if (item == 'developerTools') continue

      if (handler) {
	log(`'${item}`)
        
	Mousetrap.bind(key, (e) => {
	  command.prev = command.current
	  command.current = item
	  log(`*${item}*`)
          
	  handler()
	  return (ui.dialog.isOpen()) ? true : false

	}, 'keydown')

      } else {
	log(`'${item}': no such command`)
      }
    }

//  Mousetrap.bind('space', (e) => {
//    Controller.clearMove()
//    return false;
//  })

//  Mousetrap.bind('enter', (e) => {
//    if (ui.dialog.isOpen()) return true
//    command.quickZoom()
//    return false
//  })

//  Mousetrap.bind('space', (e) => {
//    if (!Controller.isMoved()) {
//	command.quickZoom();
//    }
//    return false;
//  }, 'keyup')
  }
}

const shortcut = new Shortcut()

export { shortcut }

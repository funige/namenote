import { command } from './command.js'

let pageButton
let textButton

////////////////////////////////////////////////////////////////

class DockTab {
  constructor() {
    this.buttons = []
  }

  init() {
    pageButton = $('#page-view-button').textButton({
      text: T('Pages'),
      locked: true,
      click: (e) => {
        if ($(e.target).textButton('instance')) {
          command.showPageView()
        }
      },
      dblclick: (e) => {
        LOG('dblclick page tab')
      },
    })[0]

    textButton = $('#text-view-button').textButton({
      text: T('Texts'),
      click: (e) => {
        if ($(e.target).textButton('instance')) {
          command.showTextView()
        }
      },
      dblclick: (e) => {
        LOG('dblclick text tab')
      },
    })[0]

    this.buttons.push(pageButton, textButton)
  }

  update() {
  }

  select(name) {
    for (const button of this.buttons) {
      const locked = $(button).textButton('locked')

      if (button && button.id.indexOf(name) == 0) {
        if (!locked) {
          $(button).textButton('locked', true)
        }
      } else {
        if (locked) {
          $(button).textButton('locked', false)
        }
      }
    }
  }
}

const dockTab = new DockTab()

export { dockTab }

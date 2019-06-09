import { command } from './command.js'

////////////////////////////////////////////////////////////////

class DockTab {
  constructor() {
    this.buttons = []
  }

  init() {
    const textButton = $('#text-view-button').textButton({
      text: T('Texts'),
      locked: true,
      click: (e) => {
        if ($(e.target).textButton('instance')) {
          command.showTextView()
        }
      },
      dblclick: (e) => {
        LOG('dblclick text tab')
      },
    })[0]

    const pageButton = $('#page-view-button').textButton({
      text: T('Pages'),
      click: (e) => {
        if ($(e.target).textButton('instance')) {
          command.showPageView()
        }
      },
      dblclick: (e) => {
        LOG('dblclick page tab')
      },
    })[0]

    const noteButton = $('#note-view-button').textButton({
      text: T('Notes'),
      click: (e) => {
        if ($(e.target).textButton('instance')) {
          command.showNoteView()
        }
      },
      dblclick: (e) => {
        LOG('dblclick note tab')
      },
    })[0]

    this.buttons.push(textButton, pageButton, noteButton)
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

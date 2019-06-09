import { View } from './view.js'
import { ViewFooter } from './view-footer.js'


class NoteView extends View {
  constructor(element) {
    super(element)
    this.id = 'note'

    $(this.element).html(`
      <div class='content'></div>
      <ul class='thin-toolbar border-top'></ul>`)
    this.content = $(this.element).find('.content')[0]
    this.footer = new ViewFooter($(this.element).find('.thin-toolbar')[0])

    this.init()
  }

  init() {
  }
}

export { NoteView }

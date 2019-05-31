import { View } from './view.js'
import { ViewFooter } from './view-footer.js'

////////////////////////////////////////////////////////////////

class TextView extends View {
  constructor(element) {
    super(element)
    this.id = 'text'

    $(this.element).html(`
      <div class='content'></div>
      <ul class='thin-toolbar border-top'></ul>`)
    this.content = $(this.element).find('.content')[0]
    this.footer = new ViewFooter($(this.element).find('.thin-toolbar')[0])

    this.enableSmoothScroll(this.content)
    this.init()
  }

  init() {
    this.project = null
  }

  initProject(project) {
    if (!this.element) return

    this.content.innerHTML = ''
    project.pids().forEach((pid, index) => {
      const pageElement = this.createPageElement(pid)
      this.content.appendChild(pageElement)
      this.pageData[pid] = {
        element: pageElement
      }

      const page = project.pages[index]
      if (page) {
        this.initPage(page)
      }
      this.updatePage(pid, index)
    })
  }

  initPage(page) {
    const pd = this.pageData[page.pid]
    if (!pd || !pd.element) {
      ERROR('textView: abort init page')
    }

    const texts = this.createTexts(page, page.params.text)
    LOG('initPage', page.pid, texts.childNodes.length)
    texts.childNodes.forEach((p) => {
      LOG(p.id)
      const li = document.createElement('li')
      li.id = p.id + 't'
      li.innerHTML = p.innerHTML
      li.style.whiteSpace = 'nowrap'
//    li.contentEditable = true
      li.addEventListener('input', (e) => { LOG(e) })
      pd.element.appendChild(li)
    })

    new Sortable(pd.element, {
      animation: 150,
      group: 'text-view',
    })
  }

  createPageElement(pid) {
    const element = document.createElement('ul')
    return element
  }

  updatePage(pid, index) {
    //TODO
  }

  async loadProject(project) {
    if (this.project) this.project.removeView(this)
    this.project = project
    if (!project) return
    project.addView(this)

    WARN(`textView: loadProject ${project.url}`)

    this.pageData = {}
    this.initProject(project)
  }
}

export { TextView }

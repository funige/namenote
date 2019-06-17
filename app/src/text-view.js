import { View } from './view.js'
import { ViewFooter } from './view-footer.js'


class TextView extends View {
  constructor(element) {
    super(element)
    this.id = 'text'
    
    $(this.element).html(`
      <ul class='content'></ul>
      <ul class='thin-toolbar border-top'></ul>`)
    this.content = this.element.querySelector('.content')
    this.footer = new ViewFooter(this.element.querySelector('.thin-toolbar'))

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
      const pageElement = $(`
        <li>
          <div class="count">${index + 1}</div>
          <ul class="dock-texts"></ul>
        </li>`)[0]
                     //this.createPageElement(pid)
      this.content.appendChild(pageElement)
      WARN('=>', pageElement)
      
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
    texts.childNodes.forEach((p) => {
      const text = $(`<div class="dock-text"></div>`)[0]
      const handle = $(`
        <div class="sort-handle">
          <span class="ui-icon ui-icon-grip-dotted-vertical"></span>
        </div>`)[0]
      
      text.id = p.id + 't'
      text.innerHTML = p.innerHTML
      text.style.whiteSpace = 'nowrap'
      text.contentEditable = true
      text.addEventListener('input', (e) => {
        const id = e.target.id.replace(/t$/, '')
        const element = document.getElementById(id)
        if (element) {
          element.innerHTML = e.target.innerHTML
        }
      })

      const li = $('<li></li>')
      li.append($(handle))
      li.append($(text))
      $(pd.element.getElementsByTagName('ul')[0]).append(li)
    })

    LOG('..', pd.element.getElementsByTagName('ul')[0])
    
    new Sortable(pd.element.getElementsByTagName('ul')[0], {
      animation: 150,
      group: 'text-view',
      onEnd: (e) => {
        LOG(e)
        LOG(e.oldIndex, e.newIndex, e.from, e.to)
      }
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

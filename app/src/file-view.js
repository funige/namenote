import { View } from './view.js'
import { Footer } from './footer.js'
import { config } from './config.js'

////////////////////////////////////////////////////////////////

class FileView extends View {
  constructor(element, dialogElement) {
    super(element, dialogElement)
    this.id = 'file'

    $(this.element).html(`
      <div class='content'></div>
      <ul class='thin-toolbar border-top'></ul>`)
    this.content = $(this.element).find('.content')[0]
    this.footer = new Footer($(this.element).find('.thin-toolbar')[0])
    
    this.enableSmoothScroll(this.content)
    this.init()
  }

  init() {
    this.project = null
    
    new Sortable(this.content, {
      animation: 150,
      handle: '.sort-handle',
    })
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
      if (project.pages[index]) {
        const page = project.pages[index]
        this.initPage(page)
      }
      
      this.updatePage(pid, index)
    })
  }
  
  initPage(page) {
    const pd = this.pageData[page.pid]
    if (!pd || !pd.element) {
      ERROR('abort init page', page.pid)
      return
    }

    const rect = this.project.getThumbnailSize()
    pd.thumbnail = new Image(rect.width, rect.height)
    pd.thumbnail.src = page.thumbnail.toDataURL('image/png')
    pd.thumbnail.className = 'thumbnail'
    pd.thumbnail.style.marginLeft = '27px'

    const text = $(`<div style='width:22px;height:100%;border-right:1px solid #ccc; overflow-x:hidden;font-size:10px;'>830</div><div>${page.digest()}</div>`)
    const handle = $('<div class="sort-handle">[handle]</div>')
    $(pd.element).append(text)
    $(pd.element).append(pd.thumbnail)
    $(pd.element).append(handle)
  }
  
  createPageElement(pid) {
    const element = document.createElement('li')
    const rect = this.project.getThumbnailSize()
    element.style.height = PX(rect.height + 10)
    return element
  }

  updatePage(pid, index, updateThumbnail) {
    const page = this.project.pages[index]
    if (page && updateThumbnail) {
      const pd = this.pageData[page.pid]
      pd.thumbnail.src = page.thumbnail.toDataURL('image/png')

      const rect = this.project.getThumbnailSize()
      pd.thumbnail.style.width = rect.width
      pd.thumbnail.style.height = rect.height
      pd.element.style.height = PX(rect.height + 10)
    }
  }
  
  async loadProject(project) {
    if (this.project) this.project.removeView(this)
    this.project = project
    if (!project) return
    project.addView(this)

    WARN(`[load project] ${project.url}`)
    
    this.pageData = {}
    this.initProject(project)

    const url = project.url.replace(/[^/]+\/[^/]+$/, '')
    if (this.dialogElement) this.dialogElement.updateFolders(url, project.url)
  }

  ////////////////
  
  showProgress(message) {
    WARN('fileView: show progress', message)
  }

  showSpinner() {
    WARN('[show spinner]')
  }

  hideSpinner() {
    WARN('[hide spinner]')
  }
}

export { FileView }

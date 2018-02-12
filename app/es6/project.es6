'use strict'

import { View } from './view.es6'
import { Page } from './page.es6'
import { config } from './config.es6'
import { RecentURL } from './recent-url.es6'
import { bookmark } from './bookmark.es6'
import { History } from './history.es6'
import { Scratch } from './scratch.es6'
import { Wand } from './wand.es6'
import { Selection } from './selection.es6'
import { helper } from './helper.es6'
import { historyButton } from './history-button.es6'
import { Tool } from './tool.es6'
import { toolBar } from './tool-bar.es6'
import { Menu } from './menu.es6'
import { command } from './command.es6'
import { Canvas } from './canvas.es6'
import { Controller } from './controller.es6'
import { Text } from './text.es6'
import { Autosave } from './autosave.es6'
import { Title } from './title.es6'
import { PageBuffer } from './page-buffer.es6'
import { TextBuffer } from './text-buffer.es6'

import { projectTemplate } from './project-template.es6'
import { bookmarkDefault } from './bookmark-default.es6'


class Project {
  constructor(url) {
//  url = url.replace(/\\/g, '\\\\')
    url = url.replace(/\\/g, '/')
    
    this.url = url
    this.bookmark= new View()
    this.history = new History(this)
    
    this.element = document.createElement('div')
    this.element.className = 'project'
    
    this.pages = []
    this.currentPage = null
    this.maxPID = 0
    this.maxID = 0
    
    this.dirty = true
  }

  destructor() {
    if (this.scratch) this.scratch.destructor()
    if (this.wand) this.wand.destructor()
    if (this.selection) this.selection.destructor()
    if (this.history) this.history.destructor()
    if (this.bookmark) this.bookmark.destructor()
    for (let i = 0; i < this.pages.length; i++) {
      this.pages[i].destructor()
    }
  }

  init(data) {
    this.params = $.extend({}, data.params)
    const pageCount = this.params.page_count
    
    helper.setDPI(this.params.dpi)
    this.pageSize = namenote.helper.topx(this.params.page_size)
    this.exportSize = namenote.helper.topx(this.params.export_size)
    this.finishingSize = namenote.helper.topx(this.params.finishing_size)
    this.baseframeSize = namenote.helper.topx(this.params.baseframe_size)

    this.scratch = new Scratch(this)
    this.wand = new Wand(this)
    this.selection = new Selection(this)
    this.framePNG = this.getFramePNG()

    for (let i = 0; i < pageCount; i++) {
      const pid = (data.pids) ? data.pids[i] : null
      this.currentPage = this.appendPage(pid)
      this.currentPage.updateIndex(i + 1)
      if (this.maxPID < (pid || 0)) this.maxPID = pid
    }
    this.selectPage(this.pages[0].pid)
    return this
  }

  stringify() {
    const result = {}
    result.params = $.extend({}, this.params)
    result.pids = []
    for (const page of this.pages) {
      result.pids.push(page.pid)
    }
    return JSON.stringify(result)
  }

  /*
  load(callback) {
    const name = this.url
    const folder = this.Url.replace(/\/[^\/]+$/, '')
    nn.log(`project urls="${url}" folder="${folder}"`)

//  switch (true) {
//  case /\.csnf$/i.test(url):
//  }
  }
  */
  
  name() {
    return (this.url) ? this.url.replace(/^.*\//, '') : Project.getDefaultURL()
  }

  path() {
  }
  
//  getBookmark() {
//    return this.bookmark
//  }
  
  getPageInfo(startPage, endPage) {
    const bind = this.params.bind_right
    const info = []

    if (startPage === undefined) startPage = 1
    if (endPage === undefined) endPage = this.pages.length
    
    const array = this.getPageArray(startPage, endPage)
    let counter = 1

    for (let i = 0; i < array.length; i += 2) {
      const item = [0]
      const i0 = array[i] ? counter++ : 0
      const i1 = array[i + 1] ? counter++ : 0

      if (bind) {
        item.push(i1, array[i + 1])
        item.push(i0, array[i])

      } else {
        item.push(i0, array[i])
        item.push(i1, array[i + 1])
      }
      info.push(item)
    }
    return info
  }

  getPageArray(startPage, endPage) {
    const array = []
    const bind = this.params.bind_right
    const start = this.params.startpage_right

    if ((bind && !start) || (!bind && start)) array.push(0)

//  for (let i = 0; i < this.pages.length; i++) {
    for (let i = startPage - 1; i <= endPage - 1; i++) {
      array.push(this.pages[i].pid)
    }

    if (array.length & 1) array.push(0)
    return array
  }

  getFramePNG() {
    const canvas = this.scratch.canvas
    const ctx = this.scratch.ctx
    ctx.fillStyle = '#ffffff' //'#fcfcfc'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.lineWidth = 1
    ctx.beginPath()

    ctx.strokeStyle = '#85bffd'
    ctx.rect(...this.baseframeRect())
    ctx.rect(...this.finishingRect())
    ctx.rect(...this.exportRect())
    ctx.stroke()
    
    const result = canvas.toDataURL('image/png')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    return result
  }

  exportRect() {
    return [0, 0, this.exportSize[0], this.exportSize[1]]
  }
  
  finishingRect() {
    const finishingX = Math.round((this.exportSize[0] - this.finishingSize[0]) / 2)
    const finishingY = Math.round((this.exportSize[1] - this.finishingSize[1]) / 2)
    return [finishingX, finishingY, this.finishingSize[0], this.finishingSize[1]]
  }
  
  baseframeRect() {
    const baseframeX = Math.round((this.exportSize[0] - this.baseframeSize[0]) / 2)
    const baseframeY = Math.round((this.exportSize[1] - this.baseframeSize[1]) / 2)
    return [baseframeX, baseframeY, this.baseframeSize[0], this.baseframeSize[1]]
  }

  exportFrameRect() {
    return [0, 0, this.exportframeSize[0], this.exportframeSize[1]]
  }
  
  pageRect(isRight) {
    const c = this.bookmark

    if (c.showMargin) {
      return [0, 0, this.exportSize[0], this.exportSize[1]]

    } else {
      if (c.singleSided) {
        return this.finishingRect()

      } else {
        const rect = this.finishingRect()
        const x = Math.round((this.exportSize[0] - this.baseframeSize[0]) / 2)
        const w = Math.round((this.finishingSize[0] + this.baseframeSize[0]) / 2)

        if (isRight) {
          return [x - c.spineMargin, rect[1], w + c.spineMargin, rect[3]]
        } else {
          return [rect[0], rect[1], w + c.spineMargin, rect[3]]
        }
      }
    }
  }
  
  setBindRight(value) {
    this.params.bind_right = value
    this.update()
  }

  toggleBindRight() {
    this.setBindRight(!this.params.bind_right)
  }

  setStartpageRight(value) {
    this.params.startpage_right = value
    this.update()
  }

  toggleStartpageRight() {
    this.setStartpageRight(!this.params.startpage_right)
  }

  update() {
    for (const page of this.pages) {
      page.update()
    }
    if (this == Project.current) {
      View.update()
    }
  }


  findPageIndex(pid) {
    for (let i = 0; i < this.pages.length; i++) {
      if (this.pages[i].pid == pid) return i
    }
    return -1
  }
  
  findPage(pid) {
    const index = this.findPageIndex(pid)
    return (index >= 0) ? this.pages[index] : null
  }  

  selectPage(pid) {
    if (this.currentPage) {
      if (this.currentPage.pid != pid) {
        Tool.setSkip(true)
      }
      
      this.currentPage.unselect()
      this.currentPage = null
    }
    const index = this.findPageIndex(pid)
    if (index >= 0) {
      const page = this.pages[index]
      this.currentPage = page
      page.select()
      Title.setTitle()
    }
  }

  ////////////////////////////////////////////////////////////////
  
  insertPage(pid) {
    const index = (this.currentPage) ? this.currentPage.index : this.pages.length
    const page = new Page(this, pid)

    const reference = this.pages[index - 1]
    this.element.insertBefore(page.element, reference && reference.element)
    this.pages.splice(index - 1, 0, page)
    this.params.page_count = this.pages.length
    
    this.selectPage(page.pid)
    View.update()

    Autosave.pushProject(this)
    return page
  }

  appendPage(pid) {
    const index = (this.currentPage) ? this.currentPage.index : 0
    const page = new Page(this, pid)

    const reference = this.pages[index]
    this.element.insertBefore(page.element, reference && reference.element)
    this.pages.splice(index, 0, page)
    this.params.page_count = this.pages.length

    View.update()

    Autosave.pushProject(this)
    return page
  }

  duplicatePage() {
    const sourcePage = this.currentPage
    const page = this.insertPage()

    //page.texts.innerHTML = sourcePage.texts.innerHTML
    page.resurrect(sourcePage.texts.innerHTML)
    
    Canvas.copy(page.ctx, sourcePage.canvas)
    View.update()

    Autosave.pushPage(page)
    Autosave.pushProject(this)
    return page
  }

  cutPage() {
    if (this.pages.length <= 1) return

    const index = this.currentPage.index
    const page = this.pages.splice(index - 1, 1)[0]
    PageBuffer.push(page)

    this.params.page_count = this.pages.length
    this.element.removeChild(this.currentPage.element)

    const newIndex = (index > this.pages.length) ? this.pages.length : index
    this.selectPage(this.pages[newIndex - 1].pid)
    View.update()

    Autosave.pushProject(this)
  }

  pastePage() {
    if (PageBuffer.hasPage()) {
//    for (const item of PageBuffer.list) {
      for (let i = PageBuffer.list.length - 1; i >= 0; i--) {
        const item = PageBuffer.list[i]
        const page = this.insertPage()
        page.ctx.putImageData(item.imageData, 0, 0)
        page.resurrect(item.texts)
        Autosave.pushPage(page)
      }
      PageBuffer.pasted = true
    }
    Autosave.pushProject(this)
  }
  
  movePageBackward() {
    const index = this.currentPage.index
    if (index >= this.pages.length) return

    const reference = this.pages[index]
    this.element.insertBefore(reference.element, this.currentPage.element)
    const page = this.pages.splice(index - 1, 1)[0]
    this.pages.splice(index, 0, page)
    View.update()

    Autosave.pushProject(this)
  }

  movePageForward() {
    const index = this.currentPage.index
    if (index <= 1) return

    const reference = this.pages[index - 2]
    this.element.insertBefore(this.currentPage.element, reference.element)
    const page = this.pages.splice(index - 1, 1)[0]
    this.pages.splice(index - 2, 0, page)
    View.update()
    
    Autosave.pushProject(this)
  }

  findPageFromEvent(e) {
    for (let i = this.element.childNodes.length - 1; i >= 0; i--) {
      const element = this.element.childNodes[i]
      const pid = Page.getPID(element)
      if (pid) {
        const page = this.findPage(pid)
        const pos = page.positionFromEvent(e)
        const rect = this.pageRect(page.isRight)
        if (pos[0] >= rect[0] &&
            pos[1] >= rect[1] &&
            pos[0] < rect[0] + rect[2] &&
            pos[1] < rect[1] + rect[3]) {
          nn.log('findPageFromEvent', page.pid)
          return page
        }
      }
    }
    return null
  }

  ////////////////////////////////////////////////////////////////

  undo() {
    if (this.selection.lifted) this.selection.drop()
    const item = this.history.popUndo()
    if (item) {
      const page = this.findPage(item.pid)
      if (page) {
        page.pushRedo(item)
        page.apply(item)
      }
    }
    historyButton.update()
  }

  redo() {
    if (this.selection.lifted) this.selection.drop()
    const item = this.history.popRedo()
    if (item) {
      const page = this.findPage(item.pid)
      if (page) {
        page.pushUndo(item, true)
        page.apply(item)
      }
    }
    historyButton.update()
  }

  ////////////////////////////////////////////////////////////////

  cut(data) {
    if (Text.isEditable(document.activeElement)) return

//  const skipClear = data.match(/^[\/s]*$/)
//  if (skipClear) nn.log('skip clearClipboard...', data)

    this.selection.cutText(data, false)
  }
  
  copy(data) {
    if (Text.isEditable(document.activeElement)) return

//  const skipClear = data.match(/^[\s]*$/)
//  if (skipClear) nn.log('skip clearClipboard...', data)

    this.selection.copyText(data, false)
  }
  
  paste(data) {
    if (Text.isEditable(document.activeElement)) return
    nn.log('paste text', data)
    
    if (data.match(/^[\s]*$/) && TextBuffer.hasText()) {
      this.pasteText()
      
    } else {
      this.pasteClipboard(data)
    }
  }
  
  pasteClipboard(data) {
    let page = this.findPageFromEvent()
    let pos
    
    if (!page) {
      page = this.currentPage
      const rect = page.project.baseframeRect()
      pos = [rect[0] + rect[2], rect[1]]

    } else {
      pos = page.positionFromEvent()
    }
    this.selection.clear()

    const list = data.split(/\n\n/)
    Text.pasteAsync(page, pos[0], pos[1], list, (err) => {
      if (!err) {
        Autosave.pushPage(page)
      } else nn.log(err)
    })

    TextBuffer.clear()
  }

  pasteText() {
    let page = this.findPageFromEvent()
    if (!page) {
      page = this.currentPage
    }
    this.selection.clear()

    for (const element of TextBuffer.list) {
      const clone = element.cloneNode(true)

      //ここでblueとinputイベントを再実装しないと。
      page.texts.appendChild(clone)
      page.setupTextElement(clone)
      page.project.selection.add(clone)
    }
    Autosave.pushPage(page)
  }

  setExportSettings(form) {
    this.exportName = form.name.value.replace(/.csnf$/, '')
    this.exportScale = parseFloat(form.scale.value)

    switch (parseInt(form.page.value)) {
    case 1:
      this.exportStart = this.currentPage.index
      this.exportEnd = this.currentPage.index
      break

    case 2:
      this.exportStart = parseInt(form.from.value)
      this.exportEnd = parseInt(form.to.value)
      break

    case 0:
    default:
      this.exportStart = 1
      this.exportEnd = this.pages.length
      break
    }
  }
}

////////////////////////////////////////////////////////////////

Project.current = null
Project.template = projectTemplate

Project.create = (url, data) => {
  if (!data) data = projectTemplate['Manga']

  const project = new Project(url).init(data)
  Project.select(project)
  return project
}

Project.findIndex = (url) => {
  for (let i = 0; i < Project.list.length; i++) {
    if (Project.list[i].url === url) return i
  }
  return -1
}
  
Project.find = (url) => {
  const index = Project.findIndex(url)
  return (index >= 0) ? Project.list[index] : null
}

Project.select = (project) => {
  if (project) {
    const index = Project.findIndex(project.url)
    if (index < 0) Project.list.push(project)
    RecentURL.update(project.url)
  }

  Project.current = project

  //ここでdefaultPathを更新するように。open-new-dialogの更新は取り除く
  //config.data.defaultPath = project.getPath()
  
  toolBar.updateButtons()
  Tool.select('pen')
  
  View.setProject()
}


Project.getDefaultURL = () => {
  return T('Untitled')
}

Project.open = (url, callback) => {
  let project = Project.find(url)
  if (!project) {
    command.loadProject(url, (data) => {
      project = Project.create(url, data)
      if (project && callback) {
        callback(project)
      }
    })
    
  } else {
    Project.select(project)
    if (callback) callback(project)
  }
}

Project.close = (project) => {
  if (!project) return
  
  const index = Project.findIndex(project.url)
  if (index >= 0) {
    Project.list.splice(index, 1)
    if (project == Project.current) {
      Project.select(Project.list[Project.list.length - 1])
    }
    project.destructor()
    Menu.update();
  }
}

Project.closeAll = () => {
  while (Project.current) {
    Project.close(Project.current)
  }
}
  

export { Project }

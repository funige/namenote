'use strict'

import { Page } from './page.es6'
import { Project } from './project.es6'
import { Autosave } from './autosave.es6'
import { Text } from './text.es6'
import { Tool } from './tool.es6'
import { TextBuffer } from './text-buffer.es6'


class Selection {
  constructor(project) {
    this.project = project
    this.list = []
    this.pid = null

    this.lifted = false
    
    this.element = document.createElement('div')
    this.element.className = 'selection'
//  this.element.style.color = 'red'
    project.element.appendChild(this.element)
  }

  destructor() {
    this.project = null
  }

  init() {
    this.clear()
  }

  add(element) {
    if (this.lifted) return
    for (const item of this.list) {
      if (item === element) return
    }
    
    const pid = Page.getPID(element)
    if (this.list.length > 0 && this.pid != pid) {
      this.clear()
    }
    this.pid = pid
    this.list.push(element)
    $(element).addClass('selected')
  }

  remove(element) {
    if (this.lifted) return
    for (let i = this.list.length - 1; i >= 0; i--) {
      const item = this.list[i]
      if (item == element) {
        $(item).removeClass('selected')
        this.list.splice(i, 1)
      }
    }
  }
  
  removeOthers(element) {
    if (this.lifted) return
    for (let i = this.list.length - 1; i >= 0; i--) {
      const item = this.list[i]
      if (item != element) {
        $(item).removeClass('selected')
        this.list.splice(i, 1)
      }
    }
  }

  removeBlank() { 
    for (let i = this.list.length - 1; i >= 0; i--) {
      const item = this.list[i]
      if (item.innerHTML.match(item.innerHTML.match(/^[\s]*<br\/?[\s]*$/))) {
        //どんなのがマッチするのか忘れたので確認します
        console.error('removeBlank', item.innerHTML)
      }
          
      if (item.innerHTML.match(/^[\s]*$/)) {
        item.parentNode.removeChild(item)
        this.list.splice(i, 1)
      }
    }
  }
  
  
  clear() {
    if (this.lifted) this.drop()
    
    while (this.list.length > 0) {
      this.remove(this.list[0])
    }
    this.pid = null
    this.lifted = false
  }

  cutText(data, skipClear) {
    if (this.lifted) this.drop()
    TextBuffer.clear()
    if (!skipClear) TextBuffer.clearClipboard()
    
    for (const element of this.list) {
      $('#text-buffer')[0].appendChild(element)
      TextBuffer.push(element)
    }
    this.clear()
  }

  copyText(data, skipClear) {
    if (this.lifted) this.drop()
    TextBuffer.clear()
    if (!skipClear) TextBuffer.clearClipboard()

    for (const element of this.list) {
      const clone = element.cloneNode(true)
      delete(clone.id)

      $('#text-buffer')[0].appendChild(clone)
      TextBuffer.push(clone)
    }
  }

  prepareSave() {
    const page = this.project.findPage(this.pid)
    console.log('page', page) //debug
    console.log('page.texts', page.texts) //debug
    this.texts = page.texts.innerHTML
  }

  liftElement(element) {
    const offset = this.getPageOffset(element.parentNode)
    const info = {
      parent: element.parentNode,
      before: element.nextSibling,
      x: offset.x,
      y: offset.y
    }
    const x = parseFloat(element.style.left) + offset.x
    const y = parseFloat(element.style.top) + offset.y
    element.style.left = x + "px"
    element.style.top = y + "px"
// element.style.color = 'red' // test to check lifted elements
    this.element.appendChild(element)
    return info
  }

  lift() {
    if (!this.lifted) {
      this.lifted = true
      this.prepareSave()
        
      this.liftinfo = []
      for (const element of this.list) {
        this.liftinfo.push(this.liftElement(element))
      }
    }
  }

  dropInBlur(node) {
    if (this.lifted && this.list.length == 1 && this.list[0] === node) {
      nn.log('dropInBlur', this.lifted, this.list)
      this.drop()
      Tool.setSkip(false)
    }
  }

  dropElement(index, target) {
    const element = this.list[index]
    //element.style.color = 'black'

    if (!target) {
      const info = this.liftinfo[index]
      const x = parseFloat(element.style.left) - info.x
      const y = parseFloat(element.style.top) - info.y
      element.style.left = x + "px"
      element.style.top = y + "px"
      info.parent.insertBefore(element, info.before)

    } else {
      // drop interpage
      const offset = this.getPageOffset(target.texts)
      const x = parseFloat(element.style.left) - offset.x
      const y = parseFloat(element.style.top) - offset.y
      element.style.left = x + "px"
      element.style.top = y + "px"
//    target.texts.appendChild(element)
      target.texts.insertBefore(element, target.texts.firstElementChild)
    }
  }
  
  drop(target) {
    if (this.lifted) {
      const page = this.project.findPage(this.pid)
      if (target == page) target = null

      //const inv = (target && target.index < page.index) ? true : false 
      for (let i = this.list.length - 1; i >= 0; i--) {
        this.dropElement(i, target)
      }
      
      this.lifted = false
      if (target) this.pid = target.pid

      this.removeBlank()

      // オートセーブ。これは未完成。
      Autosave.pushPage(page) //pageはthis.textsを使ってセーブする
      if (target) Autosave.pushPage(target) //targetのデータを作ってセーブする
    }
  }

  //ここでwandの状態も保存しないとダメだ
  getStatus() {
    const ids = []
    for (const element of this.list) {
      ids.push(element.id)
    }
    nn.log({ pid:this.pid, ids:ids })
    return { pid:this.pid, ids:ids }
  }

  putStatus(status) {
    nn.log(status)
    this.clear()
    for (const id of status.ids) {
      const element = document.getElementById(id)
      nn.log('push status..', id, element)
      if (element) this.add(element)
    }    
  }
  
  addFontSize() {
    for (const element of this.list) {
      Text.addFontSize(element)
    }
    if (!this.lifted && this.list.length > 0) {
      Autosave.pushPage(this.project.findPage(this.pid))
    }
  }
  
  subtractFontSize() {
    for (const element of this.list) {
      Text.subtractFontSize(element)
    }
    if (!this.lifted && this.list.length > 0) {
      Autosave.pushPage(this.project.findPage(this.pid))
    }
  }
  
  toggleDirection() {
    for (const element of this.list) {
      Text.toggleDirection(element)
    }
    if (!this.lifted && this.list.length > 0) {
      Autosave.pushPage(this.project.findPage(this.pid))
    }
  }
  
  onDrag(dx, dy) {
    if (this.lifted) {
      for (let i = 0; i < this.list.length; i++) {
        const element = this.list[i]
        const x = parseFloat(element.style.left) - dx
        const y = parseFloat(element.style.top) - dy
        element.style.left = x + "px"
        element.style.top = y + "px"
      }
    }
  }

  getPageOffset(element) {
    let x = 0
    let y = 0
    
    while (element && element.className != 'project') {
      x += parseFloat(element.style.left || 0)
      y += parseFloat(element.style.top || 0)
      element = element.parentNode
    }
    return { x:x, y:y }
  }

  merge() {
    if (this.list.length < 2) return
    if (this.lifted) this.drop()

    const mergeList = this.getMergeList()
    if (!mergeList) {
      nn.warn('Can\'t merge selected texts.')
      return
    }
    
    const page = this.project.findPage(this.pid)
    page.pushUndo({ type:'text', pid:page.pid })

    const target = mergeList.shift()
    for (const element of mergeList) {
      //nn.warn(element.style.left, element.style.top, element.innerHTML)
      let html = Text.getHTML(element)
      if (!html.match(/^<div>.*<\/div>$/)) html = `<div>${html}</div>`

      target.innerHTML = Text.getHTML(target) + html
      this.remove(element)
      element.parentNode.removeChild(element)
    }
    Text.fixPosition(target)
    
    Autosave.pushPage(page)
  }

  getMergeList() {
    const vert = Text.isVert(this.list[0])
    const tmp = []
    let ymin, yminElement

    for (const element of this.list) {
      if (vert != Text.isVert(element)) return null

      if (vert) {
        const x = parseFloat(element.style.left) + element.offsetWidth
        tmp.push([x, element])
      } else {
        const y = parseFloat(element.style.top)
        tmp.push([-y, element])
      }
    }
    return tmp.sort((a, b) => {
      return (a[0] < b[0]) ? 1 : -1
    }).map((a) => {
      return a[1]
    })
  }
}

export { Selection }



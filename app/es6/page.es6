'use strict'

import { View } from './view.es6'
import { Text } from './text.es6'
import { Controller } from './controller.es6'
import { Selection } from './selection.es6'
import { command } from './command.es6'
import { historyButton } from './history-button.es6'

const JSZip = window.require('JSZip')


class Page {
  constructor(project, pid) {
    nn.log('page constructor', pid)
    this.project = project
    this.pid = pid || command.getPID(project)
    nn.log('PID', pid, this.pid)
    
    this.index = 0
    this.status = 0
    this.dirty = true

    this.x = 0
    this.y = 0
    this.rotate = 0
    this.scale = 1
    this.flip = false
    
    this.element = null
    this.texts = null
    this.mask = null
    this.root = null
    this.number = null
    
    this.canvas = null
    this.ctx = null

    this.params = {}
    
    this.createElements()
    this.update()

    if (pid) {
      command.loadPage(project, this, (err, data) => {
        if (!err) {
          this.params = JSON.parse(data)
          this.dirty = false
          this.unzip()

        } else {
          nn.log(`loadPage(${this.pid})`, err)
        }
      })

    } else {
      command.savePage(project, this, (err) => {
        if (err) {
          nn.log(`savePage(${this.pid})`, err)
        } else {
          this.dirty = false
        }
      })
    }
  }

  destructor() {
    if (this.dirty) {
      // 未保存ならシリアライズして保存する
      // 保存中にエラーが出たら一応警告は出すように
    }
    this.project = null
  }

  addText(x, y, params, callback) {
    if (!params) {
      params = Text.getParams()
    }

    const node = this.createTextElement()
    node.style.left = x + 'px';
    node.style.top = y + 'px';
    node.style.fontFamily = params.font
    node.style.fontSize = params.size
    node.style.writingMode = params.vert
    this.texts.appendChild(node)

    setImmediate(() => {
      node.alt = JSON.stringify({ width:'0', height:'0' })
      Text.fixPosition(node)
      callback(node)
    })
  }

  unzip() {
    this.resurrect(this.params.text)
    
    const base64 = this.params.base64
    if (!base64) return

    const zip = new JSZip()
    zip.loadAsync(base64, { base64: true })
      .then((zip) => {
        zip.file('image').async('uint8Array').then((data) => {
          const width = this.canvas.width
          const height = this.canvas.height
          const imageData = this.ctx.createImageData(width, height)
          imageData.data.set(data);
          this.ctx.putImageData(imageData, 0, 0)
        })
      })
  }
  
  createElements() {
    const texts = document.createElement('div')
    texts.className = 'texts'

    const root = document.createElement('div')
    root.className = 'page-root'
//  root.appendChild(this.createBackgroundElement())
    this.bg = this.createBackgroundElement()
    root.appendChild(this.bg)
    
    root.appendChild(this.createCanvasElement())
    root.appendChild(texts)
    
    const mask = document.createElement('div')
    mask.className = 'page-mask'
    
    const element = document.createElement('div')
    element.className = 'page'
    element.id = `page-` + this.pid
    element.appendChild(this.createNumberElement())

    mask.appendChild(root)
    element.appendChild(mask)

    mask.addEventListener('keydown', function(e) {
      mask.scrollLeft = 0
      mask.scrollTop = 0
      return true
    })

    this.element = element
    this.texts = texts
    this.mask = mask
    this.root = root
  }

  update() {
    this.updateShowMargin()
    this.updateTransform()
  }

  select() {
    this.element.className = 'page selected'
    this.number.className = 'number selected'
    this.element.style.outlineWidth = `${View.getOutlineWidth()}px`

    nn.log('select page', this.element.id)
  }

  unselect() {
    this.element.className = 'page'
    this.number.className = 'number'
    delete(this.element.style.outlineWidth)
  }

  setFlip(value) {
    if (value === undefined) value = this.flip
    this.flip = value
    this.updateTransform()
  }
  
  updateShowMargin() {
    const rect = this.project.pageRect(this.isRight)
    const element = this.element
    const mask = this.mask
    const root = this.root

    element.style.width = rect[2] + 'px'
    element.style.height = rect[3] + 'px'

    mask.style.width = rect[2] + 'px'
    mask.style.height = rect[3] + 'px'

    root.style.width = rect[2] + 'px'
    root.style.height = rect[3] + 'px'
    root.style.left = -rect[0] + 'px'
    root.style.top = -rect[1] + 'px'

    this.offsetX = rect[0]
    this.offsetY = rect[1]
  }

  updateTransform() {
    const sx = (this.flip) ? -1 : 1
    const deg = this.rotate
    this.element.style.transform = `scaleX(${sx}) rotate(${deg}deg)`
  }

  pushUndo(item, holdRedo) {
    const newItem = $.extend({}, item)
    if (item.type == 'canvas') {
      newItem.image = this.ctx.getImageData(item.x, item.y, item.width, item.height)

    } else {
      newItem.texts = this.texts.innerHTML
      newItem.status = this.project.selection.getStatus()
    }
    this.project.history.pushUndo(newItem, holdRedo)
  }

  pushRedo(item) {
    const newItem = $.extend({}, item)
    if (item.type == 'canvas') {
      newItem.image = this.ctx.getImageData(item.x, item.y, item.width, item.height)

    } else {
      newItem.texts = this.texts.innerHTML
      newItem.status = this.project.selection.getStatus()
    }
    this.project.history.pushRedo(newItem)
  }
  
  apply(item) {
    if (item.type == 'canvas') {
      this.ctx.putImageData(item.image, item.x, item.y)

    } else {
      this.resurrect(item.texts, true)
      this.project.selection.putStatus(item.status)
    }
  }
  
  createTextElement() {
    const node = this.createTextNode('', 'text', 14, true)
    this.setupTextElement(node)
    return node
  }

  setupTextElement(node, keepID) {
    const project = this.project
    
    Text.setEditable(node, false)
    $(node).removeClass('editable')
    $(node).removeClass('selected')
    $(node).css('color', '')
    
    if (!keepID) {
      node.id = Date.now() + this.project.maxID++
    }
    setImmediate(() => {
      Text.initPosition(node)
    })
    
    node.addEventListener('blur', function(e) {
      setImmediate(() => {
        project.selection.dropInBlur(node)
      })
      $(node).removeClass("editable")
      Text.setEditable(node, false)
      Text.initPosition(node)
    })

    node.addEventListener('input', function(e) {
      nn.log(e.target.innerHTML)
      Text.fixPosition(e.target)
      Text.checkText(e.target)
    })
  }
  
  createCanvasElement() {
    const canvas = document.createElement('canvas')

    //canvas.imageSmoothingQuarity = 'High'
    //canvas.imageSmoothingEnabled = false
    canvas.className = 'canvas'
    canvas.style.width = canvas.width
    canvas.style.height = canvas.height
    canvas.width = this.project.pageSize[0]
    canvas.height = this.project.pageSize[1]

    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    return canvas
  }

  createNumberElement() {
    const node = this.createTextNode('     ', 'number')
    node.style.left = '0'
    node.style.width = '100%'
//  node.style.textAlign = 'right'
    node.style.top = '100%'
    this.number = node
    this.number.style.fontFamily = 'Arial'
    return node
  }

  createTextNode(string, className, size, vert, font) {
    // テキストはabsoluteの'text-node'の下にrelativeのclassNameのテキスト。
    if (!size) size = 14
    if (!font) font = 'sans-serif'

    const text = document.createElement('div')
    text.className = className
    text.id = Date.now() + this.project.maxID++
    text.style.fontSize = size + 'px'
    text.style.fontFamily = font
    text.style.position = 'absolute'
    
    if (vert) {
      text.style.writingMode = 'vertical-rl'
      text.alt = 'ほげほげ'
//    text.style.marginLeft = text.offsetWidth + 'px'

    } else {
      text.style.writingMode = 'horizontal-tb'
    }
    
    return text

//  node.appendChild(text)
//  return node
  }
  
  createBackgroundElement() {
    const element = document.createElement('img')
    element.style.position = "absolute"
    element.pointerEvents = 'none'
    element.draggable = false
    element.onload = () => {
      this.status =  Page.STATUS.READY
    }

    element.src = this.project.framePNG
    element.style.opacity = 1.0
    return element
  }

  updateIndex(i, isRight) {
    this.index = i
    if (this.isRight != isRight) {
      this.isRight = isRight
      this.updateShowMargin()
    }

    if (this.number) {
      this.number.innerHTML = `&nbsp;&nbsp;${i}&nbsp;&nbsp;` //(${this.element.id})`
      this.number.style.fontSize = `${View.getFontSize()}px`
      this.number.style.textAlign = (isRight) ? 'left' : 'right'
    }
    
    if (this == this.project.currentPage) {
      this.element.style.outlineWidth = `${View.getOutlineWidth()}px`
    }
  }

  positionFromRaw(raw) {
    const rect = this.element.getBoundingClientRect()
    const scale = this.project.view.getScale()

    const x = (raw[0] - rect.left) / scale + this.offsetX
    const y = (raw[1] - rect.top) / scale + this.offsetY
    return [ x, y ]
  }

  positionFromEvent(e) {
    const raw = Controller.rawPositionFromEvent(e)
    return this.positionFromRaw(raw)
  }

  extractText() {
    const result = []
    //for (const element of this.texts.childNodes) {
    for (const element of this.texts.children) {
      const text = Text.normalize(element.innerHTML)
            .replace(/^\n+/, '')
            .replace(/\n+$/, '')

      if (!text.match(/^\s*$/)) {
        result.push(text)
      }
    }
    return result.join('\n\n') + '\n\n'
  }
  
  stringify() {
    this.params.pid = this.pid
    this.params.text = this.texts.innerHTML
    return JSON.stringify(this.params)
  }

  resurrect(text, keepID) {
    this.texts.innerHTML = text
    for (const node of this.texts.children) {
      this.setupTextElement(node, keepID)
    }
  }

  fixTexts() {
    //nn.log('<=', this.texts.innerHTML)    
    const array = this.texts.innerHTML.split(/<div class="text.*?"/)
    for (let i = 0; i < array.length; i++) {
      let text = array[i]
      if (text.length > 0) {
        text = "<div" + array[i]
        text = text.replace(/&nbsp;/g, '&#160;')
        text = text.replace(/&copy;/g, '&#169;')
        text = text.replace(/&laquo;/g, '&#171;')
        text = text.replace(/&raquo;/g, '&#187;')
        text = text.replace(/&yen;/g, '&#165;')
        text = text.replace(/&plusmn;/g, '&#177;')
        text = text.replace(/&minus;/g, '&#8722;')
        text = text.replace(/style="/g, 'style="white-space:nowrap; z-index:100; color:#bf0058;')

        text = text.replace(/<br>/g, "<br\/>")
        text = text.replace(/<br\/><\/div>/g, "<\/div>")
        text = text.replace(/<div>(.*?)<\/div>/g, "<br\/>$1")
        array[i] = text
      }
    }
    //nn.log('=>', array)
    return array.join('') //('\n\n')
  }
  
  capture(imageType, callback) {
    const style = 'position:absolute;'
    const image = this.canvas.toDataURL('image/png')
    const texts = this.fixTexts()

    const width = this.canvas.width
    const height = this.canvas.height    

    const destCanvas = document.createElement('canvas')
    destCanvas.width = this.project.exportSize[0]
    destCanvas.height = this.project.exportSize[1]
    const ctx = destCanvas.getContext('2d')
//  ctx.fillStyle = '#ffffff'
//  ctx.fillRect(0, 0, destCanvas.width, destCanvas.height)
    ctx.drawImage(this.bg, 0, 0)
    
    const data = `
       <svg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'>
         <foreignObject width='100%' height='100%'>
           <div xmlns='http://www.w3.org/1999/xhtml' style='${style}'>
　　　　　　　${texts}
           </div>
           <div xmlns='http://www.w3.org/1999/xhtml' style='${style}'>
             <img src='${image}' />
           </div>
         </foreignObject>
       </svg>`
    
    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0)
      nn.log('capture success...')
      callback(destCanvas.toDataURL(imageType))
    }
    img.onerror = (err) => {
      nn.log('capture failed...', texts)
      nn.log(err)
      callback(null)
    }

    const b64 = window.btoa(unescape(encodeURIComponent(data)));
    img.src = "data:image/svg+xml;base64," + b64
  }
}

////////////////////////////////////////////////////////////////

Page.STATUS = {
  NONE: 0,
  READY: 1,
}
  
Page.current = null

Page.getPID = (node) => {
  while (node) {
    if (node.classList && node.classList.contains('page')) {
      return parseInt(node.id.split('-')[1])
    }
    node = node.parentNode
  }
  return null
}

////////////////////////////////////////////////////////////////
export { Page }

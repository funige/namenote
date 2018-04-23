'use strict'

import { View } from './view.es6'
import { Project } from './project.es6'
import { Page } from './page.es6'
import { Menu } from './menu.es6'
import { command } from './command.es6'
import { config } from './config.es6'


class Text {}

Text.savedSize = null

Text.addFontSize = (element)  => {
  if (Text.savedSize) return
  
  const size = parseInt(element.style.fontSize)
  const newSize = (size >= 72) ? size : size + 1

  element.style.fontSize = `${newSize}px`
  Text.fixPosition(element)
  nn.log('fontSize=', element.style.fontSize)
}

Text.subtractFontSize = (element)  => {
  if (Text.savedSize) return

  const size = parseInt(element.style.fontSize)
  const newSize = (size <= 8) ? size : size - 1

  element.style.fontSize = `${newSize}px`
  Text.fixPosition(element)
  nn.log('fontSize=', element.style.fontSize)
}

Text.isVert = (element) => {
  return (element.style.writingMode == 'vertical-rl') ? true : false
}

Text.toggleDirection = (element)  => {
  if (Text.isVert(element)) {
    element.style.left = parseFloat(element.style.left) + element.offsetWidth + 'px'
    element.style.writingMode = 'horizontal-tb'
    element.alt = ''

  } else {
    element.style.writingMode = 'vertical-rl'
    element.style.left = parseFloat(element.style.left) - element.offsetWidth + 'px'
    element.alt = ''
  }

  setImmediate(() => { Text.initPosition(element) })
}

Text.readableSize = (size) => {
  const min = config.getZoomFontSize()
  const readableSize = min / Project.current.view.getScale()
  if (size < readableSize) {
    size = readableSize
    return size + 'px'
  }
  return null
}

Text.setEditable = (element, value) => {
  if (element.contentEditable && element.contentEditable == 'true') {
    if (!value) {
      element.contentEditable = false
      if (config.getZoomFont()) { 
        if (Text.savedSize) {
          element.style.fontSize = Text.savedSize + 'px'
          Text.fix(element)
          Text.fixPosition(element)
          Text.savedSize = null
        }
      }
      Menu.update(element);
    }
  } else {
    if (value) {
      element.contentEditable = 'true'
      if (config.getZoomFont()) {
        const readableSize = Text.readableSize(parseFloat(element.style.fontSize))
        if (readableSize) {
          Text.savedSize = parseFloat(element.style.fontSize)
          element.style.fontSize = readableSize
          Text.fixPosition(element)
        }
      }
      /*
      if (config.getZoomFont()) {
        if (element.style.fontSize) {
          Text.savedSize = parseFloat(element.style.fontSize)
          element.style.fontSize = Text.readableSize(Text.savedSize)
          Text.fixPosition(element)
        }
      }
      */
      Menu.update(element);
    }
  }
}

Text.isEditable = (element)  => {
  if (element) {
    if (element.tagName == 'INPUT' ||
        element.tagName == 'SELECT' ||
        element.tagName == 'TEXTAREA' ||
        (element.contentEditable && element.contentEditable == 'true')) {
      //element.contentEditable) {
      return true
    }
  }
  return false
}

Text.initPosition = (element) => {
  const width = element.offsetWidth
  const height = element.offsetHeight
  element.alt = JSON.stringify({ width: width, height: height })
}

Text.fixPosition = (element) => {
  const width = element.offsetWidth
  const height = element.offsetHeight

  if (Text.isVert(element)) {
    const data = JSON.parse(element.alt)
    if (width != data.width) {
      const left = parseFloat(element.style.left) - (width - data.width)
      element.style.left = left + "px"
    }
  }
  element.alt = JSON.stringify({ width: width, height: height })
}

Text.getHTML = (element) => {
  // このへんは早めに整理しないとまずい
  const html = element.innerHTML
        .replace(/<span[^>]*>(.*?)<\/span>/g, "$1")
        .replace(/<div><br><div>/g, "<div><br><\/div><div>")
  return html
}

Text.fix = (element) => {
  element.innerHTML = Text.getHTML(element)
}

Text.checkText = (element) => {
  const html = Text.getHTML(element)
  
//if (html.match(/^<div><br><\/div>/)) {
//  Text.blankMove(element)
//}
  
  if (html.match(/<div><br><\/div><div><br><\/div>$/)) {
    if (html.match(/^<div><br><\/div><div><br><\/div>$/)) {
      Text.blankMove(element)

    } else {
      Text.append(element)
    }

  } else if (html.match(/<div><br><\/div><div><br><\/div>/)) {
    Text.divide(element)
  }
}

Text.blankMove = (element) => {
  if (!Text.isVert(element)) {
    let y = parseFloat(element.style.top) + element.offsetHeight
    element.style.top = y + 'px'
  }

  element.innerHTML = ''
  nn.warn(element.innerHTML)
  Text.initPosition(element)
}

Text.append = (element) => {
  const project = Project.current
  const html = Text.getHTML(element)
  element.innerHTML = html.replace(/<div><br><\/div><div><br><\/div>$/, '')

  Text.fixPosition(element)
  project.selection.drop()

  let x = parseFloat(element.style.left)
  let y = parseFloat(element.style.top)
  if (!Text.isVert(element)) {
    y += element.offsetHeight
  }
    
  const page = project.findPage(Page.getPID(element))
  if (page) {
    page.addText(x, y, Text.getParams(element), (node) => {
      node.style.writingMode = element.style.writingMode
      node.style.fontSize = element.style.fontSize
      setImmediate(() => {
        project.selection.clear()
        project.selection.add(node)
        command.toggleEditMode()
      })
    })
  }
}

Text.divide = (element) => {
  const project = Project.current
  const html = Text.getHTML(element)
  const array = html.split(/<div><br><\/div><div><br><\/div>/)
  nn.warn('array=', array)
  element.innerHTML = array[0]

  Text.fixPosition(element)
  project.selection.drop()
  if (array.length == 0) return
  
  let x = parseFloat(element.style.left)
  let y = parseFloat(element.style.top)
  if (!Text.isVert(element)) {
    y += element.offsetHeight
  }
    
  const page = project.findPage(Page.getPID(element) || project.selection.pid)
  if (page) {
    page.addText(x, y, Text.getParams(element), (node) => {
      node.style.writingMode = element.style.writingMode
      node.style.fontSize = element.style.fontSize
      node.innerHTML = array[1]
      Text.fixPosition(node)
      setImmediate(() => {
        project.selection.clear()
        project.selection.add(node)
        command.toggleEditMode()
      })
    })
  }
}

Text.pasteAsync = (page, x, y, list, callback) => {
  let item = list.shift()
  if (item) {
    item = item.replace(/\n/g, '<br>')

    const rect = page.project.baseframeRect()
    if (x < rect[0]) {
      x = rect[0] + rect[2]
      y += rect[3] / 4
    }
    
    page.addText(x, y, Text.getParams(), (node) => {
      page.project.selection.add(node)
      node.innerHTML = item
      Text.fixPosition(node)
      
      if (list.length > 0) {
        Text.pasteAsync(page, x - node.offsetWidth, y, list, callback)

      } else {
        if (callback) callback()
      }
    })
  }
}

Text.getParams = (element) => {
  const params = {}
  if (element) {
    params.font = element.style.fontFamily
    params.size = element.style.fontSize
    params.vert = element.style.writingMode

  } else {
    const size = document['arrow-form'].size.value
    const vert = (document['arrow-form'].vert.value != 0) ? true : false

    params.font = 'sans-serif'
    params.size = size + 'px' //14 + 'px'
    params.vert = vert ? 'vertical-rl' : 'horizontal-tb'
  }
  return params
}

Text.normalize = (html) => {
  nn.log(html)
  
  let result = html
      .replace(/^<div[^>]*>/, '')
      .replace(/(<br>)?<\/div><div[^>]*>/g, '\n')
      .replace(/<br>/g, '\n')
      .replace(/<div[^>]*>/g, '\n')
      .replace(/<\/div>/g, '')

  result = result
    .replace(/&nbsp;/g, ' ')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')

  nn.log('=>', result)
  return result
}

Text.nextNode = (node) => {
  if ($(node).hasClass('text')) {
    let next = node.nextSibling
    if (next) return next

    const project = Project.current
    let index = project.findPageIndex(Page.getPID(node)) + 1

    while (index < project.pages.length) {
      const page = project.pages[index]
      next = page.texts ? page.texts.firstElementChild : null
      if (next) {
        View.jumpPage(page)
        return next
      }
      index++;
    }
  }
  return null
}

Text.prevNode = (node) => {
  if ($(node).hasClass('text')) {
    let prev = node.previousSibling
    if (prev) return prev

    const project = Project.current
    let index = project.findPageIndex(Page.getPID(node)) - 1
    while (index >= 0) {
      const page = project.pages[index]
      prev = page.texts ? page.texts.lastElementChild : null
      if (prev) {
        View.jumpPage(page)
        return prev
      }
      index--;
    }
  }
  return null
}

//Text.getTextColor = () => {
//  return config.getValue('textColor', '#bf0058')
//}

//Text.getZoomFontSize = () => {
//  return config.getValue('zoomFontSize', 10)
//}


export { Text }

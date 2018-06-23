'use strict'

import { Project } from './project.es6'
import { Page } from './page.es6'
import { config } from './config.es6'
import { viewDefault } from './view-default.es6'
import { Animation } from './animation.es6'
import { scaleButton } from './scale-button.es6'
import { menuButton } from './menu-button.es6'
import { Title } from './title.es6'

const scrollBarWidth = 12

let root
let element
let frame

let x = 0
let y = 0
let _scale = 1
let _prevScale = 1

////////////////////////////////////////////////////////////////

class View {
  constructor(project) {
    this.project = project
    for (const key in viewDefault) {
      this[key] = viewDefault[key]
    }
  }

  destructor() {
    this.project = null
  }

  getScale() {
    return _scale
  }
}

////////////////////////////////////////////////////////////////

View.init = () => {
  element = document.createElement('div')
  element.className = 'view'

  frame = document.createElement('div')
  frame.className = 'view-frame'

  root = $('.root')[0]
  root.innerHTML = ''
  root.appendChild(frame)
  root.appendChild(element)
  root.parentNode.addEventListener('scroll', View.onScroll)
  View.onScroll({target: root.parentNode})

  window.onresize = () => View.onResize()
  window.oncontextmenu = (e) => {
    return false
  }
  
  View.show()
}

View.onScroll = (e) => {
  const project = Project.current
  if (!project) return
  
  const contentSize = View.getContentSize(project)
  const c = project.view

  const width = View.width() //e.target.offsetWidth - scrollBarWidth
  const height = View.height() //e.target.offsetHeight - scrollBarWidth
  const frameWidth = contentSize[0] * _scale + c.viewSpacing * 2
  const frameHeight = contentSize[1] * _scale + c.viewSpacing * 2
  const pad = (width > frameWidth) ? (width - frameWidth) / 2 : 0

  x = (e.target.scrollLeft - c.viewSpacing + width / 2) / _prevScale
  y = (e.target.scrollTop - c.viewSpacing + height / 2) / _prevScale
}

View.onResize = () => {
  nn.log('[onResize]')
  menuButton.onresize()

  if (Project.current) delete(Project.current.view.quickPower)
  View.update()
}

View.show = () => {
  element.style.display = 'block'
}

View.hide = () => {
  element.style.display = 'none'
}

View.setProject = () => {
  const project = Project.current
  if (project) {
    if (project.element.parentNode != element) {
      element.innerHTML = ''
      element.appendChild(project.element)
    }

  } else {
    element.innerHTML = ''
  }
  View.update()
}

View.jumpPage = (page, newPower) => {
  const parent = root.parentNode
  const pageRect = page.project.pageRect()
  const scale = View.contentWidthScale() * newPower
  
  const c = Project.current.view
  const pos = View.getPagePosition(page, scale)
  page.project.selectPage(page.pid)

  const x = pos[0] - c.viewSpacing - (View.width() - pageRect[2] * scale) / 2
  const y = pos[1] - c.viewSpacing
  View.jump(x, y, newPower)
}

View.jump = (x, y, newPower) => {
  const c = Project.current.view

  let duration = 0 //4
  if (!newPower) {
    newPower = c.power
    duration = 0 //6
  }
  Animation.setJump(x, y, newPower, duration)
}

View.update = () => {
  const project = Project.current
  if (!project) return

  const c = project.view

  View.setNoScroll()

  _scale = View.contentWidthScale() * c.power
  c.quickPower = (c.rowCount == 1) ? View.pageWidthPower() : View.pageHeightPower()
  
  const contentSize = View.getContentSize(project)
  const parent = root.parentNode
  View.onScroll({target: parent})
  
  const width = View.width() //parent.offsetWidth
  const height = View.height() //parent.offsetHeight
  const frameWidth = contentSize[0] * _scale + c.viewSpacing * 2
  const frameHeight = contentSize[1] * _scale + c.viewSpacing * 2

  const pad = (width > frameWidth) ? (width - frameWidth) / 2 : 0

  const node = project.element
  node.style.width = `${contentSize[0]}px`
  node.style.height = `${contentSize[1]}px`
  node.style.transform = `scale(${_scale})`

  frame.style.width = `${frameWidth}px`
  frame.style.height = `${frameHeight}px`

  frame.style.left = `${pad}px`

  element.style.left = `${contentSize[0] * (_scale - 1) / 2 + c.viewSpacing }px`
  element.style.top = `${contentSize[1] * (_scale - 1) / 2 + c.viewSpacing }px`
  element.style.width = '0'
  element.style.height = '0'

  parent.scrollLeft = x * _scale + c.viewSpacing - width / 2
  parent.scrollTop = y * _scale + c.viewSpacing - height / 2
  _prevScale = _scale

  View.updatePages()
  Title.setTitle()
}

View.getPagePosition = (page, scale) => {
  if (!scale) scale = View.scale()
  const c = page.project.view
  const x = (page.x) * scale + c.viewSpacing
  const y = (page.y) * scale + c.viewSpacing
  return [x, y]
}

View.updatePages = () => {
  const project = Project.current
  const pageInfo = project.getPageInfo()
  for (let i = 0; i < pageInfo.length; i++) {
    const item = pageInfo[i]
    const itemPosition = View.getItemPosition(project, i)

    const left = project.pages[item[1] - 1]
    if (left) {
      left.x = itemPosition[0]
      left.y = itemPosition[1]
      left.updateIndex(item[1], false)
      left.element.style.left = itemPosition[0] + "px"
      left.element.style.top = itemPosition[1] + "px"
    }
    const right = project.pages[item[3] - 1]
    if (right) {
      right.x = itemPosition[2]
      right.y = itemPosition[1]
      right.updateIndex(item[3], true)
      right.element.style.left = itemPosition[2] + "px"
      right.element.style.top = itemPosition[1] + "px"
    }
  }
}

View.scale = () => {
  return _scale
}

View.width = () => {
  return root && (root.parentNode.offsetWidth - scrollBarWidth)
}

View.height = () => {
  return root && (root.parentNode.offsetHeight - scrollBarWidth)
}


View.contentWidthScale = () => {
  const c = Project.current.view
  const contentSize = View.getContentSize(Project.current)
  return ((View.width() - c.viewSpacing * 2) / contentSize[0])
}

View.pageWidthPower = () => {
  const c = Project.current.view
  const pageSize = Project.current.pageRect()
  const scale = (View.width() - c.viewSpacing * 2) / pageSize[2] * 0.98
  return scale / View.contentWidthScale()
}

View.pageHeightPower = () => {
  const c = Project.current.view
  const pageSize = Project.current.pageRect()
  const scale = (View.height() - c.viewSpacing * 2) / pageSize[3] * 0.98
  return scale / View.contentWidthScale()
}

View.getItemPosition = (project, i) => {
  const c = project.view
  const sx = c.itemSpacingX
  const sy = c.itemSpacingY
    
  const bind = project.params.bind_right
  const itemSize = View.getItemSize(project)
  const modi = i % c.rowCount
  const x = (itemSize[0] + sx) * ((bind) ? c.rowCount - 1 - modi : modi)
  const y = Math.floor(i / c.rowCount) * (itemSize[1] + sy)
  const dx = project.pageRect()[2] + c.spineSpacing
  return [x, y, x + dx]
}
  
View.getContentSize = (project) => {
  const c = project.view
  const sx = c.itemSpacingX
  const sy = c.itemSpacingY

  const pageInfo = project.getPageInfo()
  const columnCount = Math.ceil(pageInfo.length / c.rowCount)
  const itemSize = View.getItemSize(project)
  return [
    (itemSize[0] + sx) * c.rowCount - sx,
    (itemSize[1] + sy) * columnCount - sy
  ]
}

View.getItemSize = (project) => {
  const c = project.view
  const rect = project.pageRect()
  return [
    rect[2] * 2 + c.spineSpacing,
    rect[3]
  ]
}

View.getFontSize = () => {
  return Math.round(24 / ((_scale > 0.5) ? _scale : 0.5))
}

View.getOutlineWidth = () => {
  return Math.round(3 / _scale)
}

// ビュー上のページ矩形の位置 (x, y, width, height)

View.getPageRectInView = (page) => {
  const pos = View.getPagePosition(page)
  const x = pos[0] - root.parentNode.scrollLeft
  const y = pos[1] - root.parentNode.scrollTop

  const pageRect = page.project.pageRect()
//return [x, y, pageRect[2] * _scale, pageRect[3] * _scale]
  return [x, y, pageRect[2] * _scale, (pageRect[3] + page.project.view.itemSpacingY) * _scale]
}


////////////////////////////////////////////////////////////////

View.getPageDY = (project, rect) => {
  const c = project.view

  let y = rect[1]
  let height = rect[3]
  if (height + c.viewSpacing * 2 >= View.height()) {
    height = View.height() - c.viewSpacing * 2
  }

  let top = 0
  let bottom = 0
  if (y + height + c.viewSpacing > View.height()) {
    bottom = y + height + c.viewSpacing - View.height()
  }
  if (y - c.viewSpacing < 0) {
    top = y - c.viewSpacing
  }

  /*
  if (top && bottom) {  
    bottom = 0
  }
  */
  return top || bottom
}

View.getPageDX = (project, rect) => {
  const c = project.view

  let x = rect[0]
  let width = rect[2]
  if (width + c.viewSpacing * 2 >= View.width()) {
    width = View.width() - c.viewSpacing * 2
    if (project.params.bind_right) x += rect[2] - width
  }
  
  let left = 0
  let right = 0
  if (x + width + c.viewSpacing > View.width()) {
    right = x + width + c.viewSpacing - View.width()
  }
  if (x - c.viewSpacing < 0) {
    left = x - c.viewSpacing
  }

  /*
  if (left && right) {
    if (project.params.bind_right) {
      left = 0
    } else {
      right = 0
    }
  }
  */
  return left || right
}

View.pageMove = (index) => {
  const project = Project.current
  const c = project.view
  if (index < 0 || index >= project.pages.length) {
    const page = project.currentPage
    index = project.findPageIndex(page.pid) 
  }
  
  const page = project.pages[index]
  project.selectPage(page.pid)
  
  const rect = View.getPageRectInView(page)

  const dx = View.getPageDX(project, rect)
  const dy = View.getPageDY(project, rect)
  
  if (dx || dy) {
    const x = root.parentNode.scrollLeft + dx
    const y = root.parentNode.scrollTop + dy
    View.jump(x, y)
  }
}

View.pageUp = () => {
  const project = Project.current
  const c = project.view
  const page = project.currentPage

  const index = project.findPageIndex(page.pid)
  View.pageMove(index - (c.rowCount * 2))
}

View.pageDown = () => {
  const project = Project.current
  const c = project.view
  const page = project.currentPage

  const index = project.findPageIndex(page.pid)
  View.pageMove(index + (c.rowCount * 2))
}

View.pageLeft = () => {
  const project = Project.current
  const c = project.view
  const page = project.currentPage

  const index = project.findPageIndex(page.pid)
  View.pageMove(index - ((project.params.bind_right) ? -1 : 1))
}

View.pageRight = () => {
  const project = Project.current
  const c = project.view
  const page = project.currentPage

  const index = project.findPageIndex(page.pid)
  View.pageMove(index + ((project.params.bind_right) ? -1 : 1))
}

View.quickZoom = () => {
  const project = Project.current
  const c = project.view
  const page = project.currentPage
  if (c && page) {
    c.quickZoom = !c.quickZoom
    scaleButton.update()

    if (c.quickZoom) {
      const parent = root.parentNode
      c.quickX = parent.scrollLeft
      c.quickY = parent.scrollTop
      View.jumpPage(page, c.quickPower)

      if (!View.noScroll) root.parentNode.style.overflowX = 'scroll'

    } else {
//    c.quickPower = c.power
      View.jump(c.quickX, c.quickY, 1)

      if (!View.noScroll) root.parentNode.style.overflowX = 'hidden'
    }
  }
}

View.zoom = () => {
  if (!Project.current) return
  const c = Project.current.view
  
  if (c) {
    if (!c.quickZoom) {
      c.quickX = root.parentNode.scrollLeft
      c.quickY = root.parentNode.scrollTop
      c.quickZoom = true
      scaleButton.update()
    }
    
    c.power /= 0.9
    View.update()

    //const x = root.parentNode.scrollLeft
    //const y = root.parentNode.scrollTop
    //View.jump(x, y, c.power / 0.9)
  }
}

View.unzoom = () => {
  if (!Project.current) return
  const c = Project.current.view

  if (c && c.quickZoom) {
    if (c.power * 0.9 > 1.0) {
      c.power *= 0.9
      //View.update()
      
      //const x = root.parentNode.scrollLeft
      //const y = root.parentNode.scrollTop
      //View.jump(x, y, c.power * 0.9)
      
    } else {
      //delete(c.quickPower)
      //c.quickX = root.parentNode.scrollLeft
      //c.quickY = root.parentNode.scrollTop

      //View.quickZoom()

      c.power = 1.0
      c.quickX = root.parentNode.scrollLeft
      c.quickY = root.parentNode.scrollTop
      c.quickZoom = false
      scaleButton.update()
    }
    View.update()
  }
}

View.flip = () => {
  const project = Project.current
  if (project) {
    const page = project.currentPage
    if (page) page.setFlip(!page.flip)
  }
}

////////////////////////////////////////////////////////////////
  
View.setShowMargin = (value) => {
  const c = Project.current.view
  if (c) {
    if (value == undefined) value = c.showMargin
    c.showMargin = value
//  delete(c.quickPower)

    Project.current.update()
  }
}

View.toggleShowMargin = () => {
  const c = Project.current.view
  if (c) {
    View.setShowMargin(!c.showMargin)
    View.jumpPage(Project.current.currentPage)
  }
}
  
View.setRowCount = (value) => {
  const c = Project.current.view
  if (c) {
    if (value == undefined) value = c.rowCount
    c.rowCount = value
    c.power = 1

    View.update()
    View.jumpPage(Project.current.currentPage)
  }
}

View.setSingleSided = (value) => {
  const c = Project.current.view
  if (c) {
    if (value == undefined) value = c.singleSided
    c.singleSided = value
    //save()
    
    View.update()
  }
}

View.toggleSingleSided = () => {
  const c = Project.current.view
  if (c) {
    View.setSingleSided(!c.singleSided)
  }
}

View.setNoScroll = () => {
  View.noScroll = config.data.noScroll

  if (!View.noScroll) {
    const c = Project.current ? Project.current.view : null
    root.parentNode.style.overflowX = (c && c.quickZoom) ? 'scroll' : 'hidden'
    root.parentNode.style.overflowY = 'scroll'

  } else {
    root.parentNode.style.overflowX = 'hidden'
    root.parentNode.style.overflowY = 'hidden'
  }
}

////////////////////////////////////////////////////////////////

View.animation = Animation


export { View }

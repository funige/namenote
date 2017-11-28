'use strict'

import { Menu } from './menu.es6'


class PageBuffer {}

PageBuffer.init = () => {
  PageBuffer.clear()
}

PageBuffer.push = (page) => {
  if (PageBuffer.pasted) PageBuffer.clear()

  const item = {}
  const width = page.canvas.width
  const height = page.canvas.height
  
  item.imageData = page.ctx.getImageData(0, 0, width, height)
  item.texts = page.texts.innerHTML
  PageBuffer.list.push(item)
  Menu.update()
}

PageBuffer.hasPage = () => {
  return (PageBuffer.list.length > 0) ? true : false
}

PageBuffer.clear = () => {
  PageBuffer.list = []
  PageBuffer.pasted = false
  Menu.update()
}

PageBuffer.list = []
PageBuffer.pasted = false


export { PageBuffer }

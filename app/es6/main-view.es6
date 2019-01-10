'use strict'

import { namenote } from './namenote.es6'

// $('.main-view')[0].parentNode.scrollTop = ...

let element

////////////////////////////////////////////////////////////////

class MainView {
  constructor() {
    this.scale = 1
  }

  init() {
    const pageWidth = 1000
    const pageHeight = 768
    element = $('.main-view')[0]
    
    for (let j = 0; j < 100; j++) {
      for (let i = 0; i < 10; i++) {
        const page = document.createElement('div')
        page.style.width = pageWidth + "px"
        page.style.height = pageHeight + "px"
        page.style.backgroundColor = "white"
        page.style.outline = "1px solid rgba(0,0,0,0.3)"

        const x = i * (pageWidth + 50) + 50
        const y = j * (pageHeight + 50) + 50
        page.style.position = 'absolute'
        page.style.left = x + "px"
        page.style.top = y + "px"
        page.style.transformOrigin = "top left"
        page.style.transform = "scale(1.0)"
        
        const pageNumber = document.createElement('div')
        pageNumber.innerHTML = (j * 10 + i + 1) + "ページ"
        pageNumber.style.fontSize = '12px' // 11px以下は変わらない
        pageNumber.style.position = 'absolute'
        pageNumber.style.left = (pageWidth / 2) + 'px'
        pageNumber.style.top = (pageHeight + 20) + 'px'

        page.appendChild(pageNumber)
        element.appendChild(page)
      }
    }
  }
}

const mainView = new MainView()

export { mainView }

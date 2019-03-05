'use strict'

import { View } from './view.es6'

// $('.main-view')[0].parentNode.scrollTop = ...

////////////////////////////////////////////////////////////////

class MainView extends View {
  constructor(element) {
    super(element)

    this.init(element)
  }

  init(element) {
    this.scale = 1

    const pageWidth = 1000
    const pageHeight = 768

    for (let j = 0; j < 10; j++) {
      for (let i = 0; i < 10; i++) {
        const page = document.createElement('div')
        page.style.width = PX(pageWidth)
        page.style.height = PX(pageHeight)
        page.style.backgroundColor = "white"
        page.style.outline = "1px solid rgba(0,0,0,0.3)"

        const x = i * (pageWidth + 50) + 50
        const y = j * (pageHeight + 50) + 50
        page.style.position = 'absolute'
        page.style.left = PX(x)
        page.style.top = PX(y)
        page.style.transformOrigin = "top left"
        page.style.transform = "scale(1.0)"
        
        const pageNumber = document.createElement('div')
        pageNumber.innerHTML = (j * 10 + i + 1) + "ページ"
        pageNumber.style.fontSize = '12px' // 11px以下は変わらない
        pageNumber.style.position = 'absolute'
        pageNumber.style.left = PX(pageWidth / 2)
        pageNumber.style.top = PX(pageHeight + 20)

        page.appendChild(pageNumber)
        this.element.appendChild(page)
      }
    }
  }

  update() {
  }
  
  setProject(project) {
    this.project = project
    if (project) {
    } else {
    }
    this.update()
  }
}

export { MainView }

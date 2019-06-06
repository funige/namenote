import { widget } from './widget.js'

////////////////////////////////////////////////////////////////

class ViewFooter {
  constructor(element) {
    this.element = element
    this.init()
  }

  
  init() {
    this.element.innerHTML = ''

    const trashButton = widget.createImageButton({
      src: 'img/zoom-button.png',
      click: (e) => {
        LOG('trash')
      },
      float: 'left',
    })
    
    const appendButton = widget.createImageButton({
      src: 'img/redo-button.png',
      click: (e) => {
        LOG('append')
      },
      float: 'left',
    })

    // test
    const sizeButton = widget.createImageButton({
      src: 'img/flip-button.png',
      click: (e) => {
        LOG('size')
      },
      float: 'right',
    })

    this.element.appendChild(trashButton)
    this.element.appendChild(appendButton)
    this.element.appendChild(sizeButton)
  }
}

export { ViewFooter }

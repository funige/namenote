'use strict'

const JSZip = require('JSZip')

////////////////////////////////////////////////////////////////

class Page {
  constructor(json) {
    this.init(json)
  }

  destructor() {
    log('page destructor', this.pid)
  }

  init(data) {
    this.params = data
    console.warn(data)
    return this
  }

  initElements() {
    this.canvas = this.createCanvas()
    this.texts = this.createTexts()
    this.ctx = this.canvas.getContext('2d')
    this.unzip()

    const element = this.getElement()
    $(element).removeClass('preload')

    // とりあえず表示してみるテスト
    element.appendChild(this.canvas)
    element.appendChild(this.texts)
  }

  unzip() {
    const base64 = this.params.base64
    if (!base64) return

    const zip = new JSZip()
    zip.loadAsync(base64, { base64:true }).then((zip) => {
      zip.file('image').async('uint8Array').then((data) => {
        const imageData = this.ctx.createImageData(this.width, this.height)
        imageData.data.set(data);
        this.ctx.putImageData(imageData, 0, 0)
      })
    })
  }

  createCanvas() {
    const canvas = document.createElement('canvas')
    canvas.className = 'canvas'
    canvas.style.backgroundColor = 'yellow'
    canvas.width = this.width
    canvas.height = this.height
    return canvas
  }

  createTexts() {
    const texts = document.createElement('div')
    texts.className = 'texts'
    texts.innerHTML = this.params.text
    return texts
  }
  
  getElement() {
    LOG(document.getElementById('page-' + this.pid))
    return document.getElementById('page-' + this.pid)
  }
}

export { Page }

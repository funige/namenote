'use strict'

const JSZip = require('JSZip')


////////////////////////////////////////////////////////////////

class Page {
  constructor(json) {
    this.init(json)
  }

  destructor() {
    LOG('page destructor', this.pid)
  }

  init(data) {
    this.params = data
    return this
  }

  async initElements(project) {
    this.width = project.pageSize[0]
    this.height = project.pageSize[1]

    this.canvas = this.createCanvasElement(this.width, this.height)
    this.canvasCtx = this.canvas.getContext('2d')

    const rect = project.getThumbnailSize()
    this.thumbnail = this.createCanvasElement(rect.width, rect.height)
    this.thumbnailCtx = this.thumbnail.getContext('2d')
    this.thumbnailCtx.filter = `none`
    this.thumbnailCtx.imageSmoothingQuality = 'high'
    
    await this.unzip(this.canvasCtx)
    this.thumbnailCtx.drawImage(this.canvas,
                                project.canvasSize[2]||0, project.canvasSize[3]||0,
                                project.canvasSize[0], project.canvasSize[1],
                                0, 0, rect.width, rect.height)
  }
  
  createCanvasElement(width, height) {
    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    return canvas
  }
  
  unzip(ctx) {
    return new Promise((resolve, reject) => {
      const base64 = this.params.base64
      if (!base64) return resolve()

      const zip = new JSZip()
      zip.loadAsync(base64, { base64:true }).then((zip) => {
        zip.file('image').async('uint8Array').then((data) => {
          const imageData = ctx.createImageData(this.width, this.height)
          imageData.data.set(data);
          ctx.putImageData(imageData, 0, 0)
          resolve()
        })
      })
    })
  }

  digest() {
    if (this.params && this.params.text) {
      return this.params.text
        .replace(/(<([^>]+)>)/ig, '/')
        .replace(/\/+/g, '/')
        .replace(/^\//, '').replace(/\/$/, '')
    }
    return ''
  }
}

export { Page }

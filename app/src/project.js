import { namenote } from './namenote.js'
import { Page } from './page.js'
import { projectManager } from './project-manager.js'
import { file } from './file.js'
import { config } from './config.js'

const thumbnailWidths = {
  'small': 50, //75,
  'middle': 100, //106,
  'large': 150,
}

////////////////////////////////////////////////////////////////

class Project {
  constructor(url, json) {
//  url = url.replace(/\\/g, '/') //TODO:Windows対応は必要だがここは不適当
    this.url = url
    this.baseURL = url.replace(/\/[^/]*$/, '')

    this.pages = []
    this.currentPage = null

    this.views = []
    
//  this.finishPageRead = false
//  this.maxPID = 0
//  this.dirty = true

    if (json) {
      this.init(json)
    }
  }

  destructor() {
    log('project destructor', this.url)
    this.pages.forEach(page => {
      page.destructor()
    })

    this.views = []
  }

  init(data) {
    this.params = data.params
    this._pids = data.pids

    this.setDPI(this.params.dpi)
    this.pageSize = this.topx(this.params.page_size || [257, 364])
    this.canvasSize = this.topx(this.params.canvas_size || this.params.export_size || [257, 364])

    //this.draftMarks = this.createDraftMarksElement()
    return this
  }

  pids() {
    return this._pids //ここは挿入とか削除のたびにあれしないとだめだ
  }
  
  name() {
    return file.truncateURL(this.url)
  }

  /*getElement() {
    return namenote.mainView.projectElement
  }*/

  addView(view) {
    if (this.views.indexOf(view) < 0) {
      this.views.push(view)
    }
  }
  
  removeView(view) {
    this.views = this.views.filter((item) => {
      return item !== view
    })
  }

  ////////////////

  createDraftMarksElement() {
    // type(100=rectangle), lineWidth(px), x,y,width,height(mm)

    const options = { color: '#85bffd' }
    const arr = this.parseShape([
      [100, 1, 0,  0,  257, 364],
      [100, 1, 19, 27, 220, 310],
      [100, 1, 39, 47, 180, 270],
    ], options)

    const width = this.topx(this.canvasSize[0])
    const height = this.topx(this.canvasSize[1])
    const string = `
      <svg class="marks" width="${width}" height="${height}">
        ${arr.join('')}
      </svg>`
    return $(string)[0]
  }

  parseShape(shape, options) {
    if (!options) options = {}
    if (!options.color) options.color = '#85bffd'
      
    const result = []
    shape.forEach((line) => {
      const type = line[0]

      switch(type) {
      case 1: //line
        break;

      case 2: //rect
        break;

      case 4: //polyline
        break;

      case 5: //text
        break;

      case 100: //rectangle
        result.push(this.parseRectangle(line, options))
        break;

      default:
        ERROR('unsupported shape found', shape)
        break;
      }
    })
    return result
  }

  parseRectangle(line, options) {
    const lineWidth = line[1]
    const x = this.topx(line[2])
    const y = this.topx(line[3])
    const width = this.topx(line[4])
    const height = this.topx(line[5])
    return `
      <rect x="${x}" y="${y}" width="${width}" height="${height}"
            fill="none" stroke="${options.color}" stroke-width="${lineWidth}" />`
  }
  
  setDPI(dpi) {
    this.dpi = dpi
  }

  topx(mm) {
    if (typeof mm === 'number') {
      return Math.round(mm * (this.dpi / 25.4))
    } else {
      return mm.map((x) => Math.round(x * (this.dpi / 25.4)))
    }
  }

  tomm(px) {
    if (typeof px === 'number') {
      return Math.round(px * (25.4 / this.dpi))
    } else {
      return px.map((x) => Math.round(x * (25.4 / this.dpi)))
    }
  }
  
  getThumbnailSize() {
    const size = config.getValue('thumbnailSize')
    const thumbnailWidth = thumbnailWidths[size]
    const scale = thumbnailWidth / this.canvasSize[0]

    const width = Math.ceil(this.canvasSize[0] * scale)
    const height = Math.ceil(this.canvasSize[1] * scale)
    return { width:width, height:height }
  }
}

export { Project }

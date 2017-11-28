'use strict'

import { Project } from './project.es6'
import { Text } from './text.es6'
import { Canvas } from './canvas.es6'
import { helper } from './helper.es6'
import { config } from './config.es6'
import { Timestamp } from './timestamp.es6'
import { exportCSNFDialog } from './export-csnf-dialog.es6'

const fs = window.require('fs')
const csnfStream = window.require('./js/lib/csnf-stream')

const JSZip = window.require('JSZip')

let files = []
let images = []
let data = {}
let pack = null

////////////////////////////////////////////////////////////////

class CSNF {}

CSNF.write = (project, filename, callback) => {
  nn.log('write', filename, '...')
  pack = csnfStream.pack()
  
  CSNF.makeData(project)
  CSNF.zipData(images, (err) => {
    if (!err) {
      CSNF.packData(files, (err) => {
	if (!err) {
	  const writeStream = fs.createWriteStream(filename)
	  writeStream.on('drain', () => { nn.log('stream drain') })
                     .on('close', () => { nn.log('csnf finished..') })
	  
	  pack.pipe(writeStream)
	  if (callback) callback()

	} else nn.log(err)
      })
    } else nn.log(err)
  })
}

CSNF.packData = (list, callback) => {
  if (list.length > 0) {
    const name = list.shift()
    const raw = data[name]
    const header = { name: name }
    nn.log('...pack', name, raw ? raw.length + 'bytes' : '')

    if (raw) {
      header.size = raw.length
      header.type = 'file'

    } else {
      header.size = 0
      header.type = 'directory'
    }

    setImmediate(() => {
      pack.entry(header, raw)
      CSNF.packData(list, callback)
    })

  } else {
    pack.finalize()
    callback()
  }
}

CSNF.zipData = (list, callback) => {
  if (list.length > 0) {
    const item = list.shift()
    nn.log('...zip', item.name, item.data.length)
    exportCSNFDialog.showMessage(T('Compressing') + ` ${list.length}...`)

    const zip = new JSZip()
    zip.file(item.name, item.data, { createFolders:false, binary:true })

    zip.generateAsync({
      type: 'uint8Array',
      compression: "DEFLATE",
      compressionOptions: {
        level: 6
      }
    }).then((content) => {
      data[item.name] = pack.newBuffer(content)
      nn.log(item.name, content.length, 'bytes...')

      CSNF.zipData(list, callback)
    })
    
  } else {
    callback()
  }
}

CSNF.initData = (project) => {
  const story = CSNF.getStory(project)
  const dir = `/${story.story_id}`
  files = [dir, `${dir}/story.json`]
  data = {}
  data[files[1]] = JSON.stringify({ body: story })
  images = []
}

CSNF.makeData = (project) => {
  CSNF.initData(project)
  const dir = files[0]
  const result = []

  for (let i = 0; i < project.pages.length; i++) {
    const page = project.pages[i]
    const pageDir = `${dir}/${page.pid}`
    files.push(pageDir)

    const image = `${pageDir}/ly_d0`
    files.push(image)
    images.push({ name: image, data: CSNF.getBitmap(page) })
    
    const text = `${pageDir}/ly_t0_t`
    files.push(text)
    data[text] = CSNF.getText(page)
  }
}

CSNF.getStory = (project) => {
  if (!project) project = Project.current
  
  const pageinfo = project.getPageInfo()
  const body = {}
  body.finishing_id = 6
  body.sheet_id = 3 //B4
  body.sheet_size = project.params.export_size
  body.serial_id = body.page_count + 1
  body.page_count = project.pages.length
  body.version = 1
  body.bind_right = project.params.bind_right
  body.finishing_size = project.params.finishing_size
  body.baseframe_id = 6
  body.author = ''
  body.story_id = 1 //5
  body.title = project.exportName //|| project.name()
  body.pageinfo_count = pageinfo.length
  body.startpage_right = project.params.startpage_right
  body.edit_date = Timestamp.toString()
  body.baseframe_size = project.params.baseframe_size
  body.dpi = project.params.dpi
  body.last_modify = 4
  body.pageinfo = pageinfo
  body.cover_col = 3
  body.layer_color = [
    [-7950848,-16736256,-16777216],
    [-16738348,-16777056,-16777216],
    [-4259752,-6291456,-16777216],
    [-1918976,-6250496,-16777216]
  ]
  return body
}

CSNF.getText = (page) => {
  if (!page) page = Project.current.currentPage
  const result = {}
  result.body = {}

  const count = page.texts.childNodes.length
  const shape = []

  for (let i = 0; i < count; i++) {
    const element = page.texts.childNodes[i]
    let x = parseFloat(element.style.left) + element.offsetWidth / 2
    let y = parseFloat(element.style.top) + element.offsetHeight / 2

//  x = x * page.project.exportSize[0] / 1000
//  y = y * page.project.exportSize[1] / 1000
    
    const size = parseFloat(element.style.fontSize)
    const string = Text.normalize(element.innerHTML)
    const vert = (element.style.writingMode == 'vertical-rl') ? true : false
	  
    const item = [5, x, y, size, 0, 0, vert, string]
    shape.push(item)
  }
  nn.log(shape)
  
  result.body = { count: count, shape: shape }
  return JSON.stringify(result)

  /*
    const result = '{"body":{"count":6,"shape":[[5,577,186,14,0,0,true,"お嬢様\\nお嬢様"],[5,352,233,14,0,0,true,"そんな格好で\\n寝ていたら\\n風邪をひきますわ"],[5,247,332,11,2,0,true,"やだ"],[5,197,389,11,2,0,true,"今死ぬほど眠いのよね"],[5,470,536,11,0,0,true,"外はこんなに\\nいい天気なのに"],[5,292,789,11,2,0,true,"まぶしい…"]]}}'
  return result
  */
}

CSNF.getBitmap = (page) => {
  let bitmap
  if (page) {
    bitmap = Canvas.makeBitmap(page.canvas)

  } else {
    bitmap = new Uint8Array(2 * 2 + 4)
    bitmap[0] = 2
    bitmap[2] = 2
  }
  return bitmap
}

CSNF.getThumbnail = (page) => {
  const img = page.project.getFramePNG()
  const data = img.replace(/^data:image\/\w+;base64,/, "")

  return pack.newBuffer(data, 'base64')
}


export { CSNF }

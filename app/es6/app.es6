'use strict'

import { config } from './config.es6'
import { CSNF } from './csnf.es6'
import { PDF } from './pdf.es6'

const { ipcRenderer } = window.require('electron')
const { app, dialog } = window.require('electron').remote

//const { clipboard } = window.require('electron').clipboard

const fs = window.require('fs')
const path = window.require('path')

const openNewParams = {
  defaultPath: null,
  properties: ['openFile', 'openDirectory'],
  filters: [
    { name: 'Namenote', extensions: ['namenote'] }
  ],
}

const openTxtParams = {
  defaultPath: null,
  properties: ['openFile'],
  filters: [
    { name: 'Plain Text', extensions: ['*'] },
  ]
}

const chooseFolderParams = {
  defaultPath: null,
  properties: ['openDirectory', 'createDirectory'],
}

const saveImageParams = {
  defaultPath: null,
  properties: ['createDirectory'],
  filters: [
    {name: 'Images', extensions: ['jpg', 'png']}, 
  ],
}

////////////////////////////////////////////////////////////////

const setSettings = (data) => {
}

const getSettings = () => {
}

const splitFileName = (name) => {
  const arr = name.split('.')
  const ext = (arr.length > 1) ? arr.pop() : null
  return {ext: ext, body: arr.join('.')}
}

const getDefaultName = (dir, name) => {
  const tmp = splitFileName(name)
  let index = 1
  let filename
  
  while (true) {
    const body = (index <= 1) ? tmp.body : `${tmp.body} ${index}`
    filename = (!tmp.ext) ? body : body + '.' + tmp.ext
    if (!fs.existsSync(path.join(dir, filename))) {
      break
    }
    index++
  }
  return filename
}

////////////////////////////////////////////////////////////////

class App {}

App.join = (dir, name) => {
  return path.join(dir, name)
}
  
App.fixPath = (dir, name, callback) => {
  if (!dir || !fs.existsSync(dir)) dir = app.getPath('home')
  name = getDefaultName(dir, name)
  if (callback) {
    callback(dir, name)
  }
}

App.dirname = (filename) => {
  return path.dirname(filename)
}

App.openDialog = (dir, callback) => {
  openNewParams.defaultPath = dir
  dialog.showOpenDialog(openNewParams, (filenames) => {
    if (filenames) {
      let filename = filenames[0]
      if (fs.lstatSync(filename).isFile()) filename = path.dirname(filename)
      callback(filename)
    }
  })
}

App.openTxtDialog = (dir, callback) => {
  openTxtParams.defaultPath = dir
  dialog.showOpenDialog(openTxtParams, (filenames) => {
    if (filenames) {
      let filename = filenames[0]
      callback(filename)
    }
  })
}

App.saveImageDialog = (dir, callback) => {
  const name = Date.now()
  const defaultPath = path.join(dir || app.getPath('downloads'), `${name}.png`)
  saveImageParams.defaultPath = defaultPath
  saveImageParams.title = T('Save Image')
  dialog.showSaveDialog(saveImageParams, (filename) => {
    callback(filename)
  })
}

App.saveImage = (url, data) => {
  const tmp = data.split(',')
  const bytes = (tmp[0].indexOf('base64') >= 0) ? atob(tmp[1]) : unescape(tmp[1])

  const mime = tmp[0].split(':')[1].split(';')[0]
  nn.log('mimestring', mime)

  const ia = new Uint8Array(bytes.length);
  for (let i = 0; i < bytes.length; i++) {
    ia[i] = bytes.charCodeAt(i);
  }
  const blob = new Blob([ia], { type: mime });
  nn.log('blob size=', blob.size)
  
  const reader = new FileReader()
  reader.onload = () => {
    const buffer = new Buffer(reader.result)
    fs.writeFile(url, buffer, {}, (err) => {
      if (!err) {
	nn.log('created', url)
      } else nn.log(err)
    })
  }
  reader.readAsArrayBuffer(blob);
}

App.chooseFolder = (dir, name, callback) => {
  chooseFolderParams.defaultPath = dir
  dialog.showOpenDialog(chooseFolderParams, (filenames) => {
    if (filenames) {
      dir = filenames[0]
      name = getDefaultName(dir, name)
      if (callback) {
	callback(dir, name)
      }
    }
  })
}

App.createFolder = (dir, name, callback) => {
  let url = path.join(dir, name) //`${path}/${name}`
  fs.mkdir(url, (err) => {
    if (!err) {
      if (callback) callback(url)

    } else {
      App.showMessageBox({
	type: 'error',
	message: T(`Duplicate note name.`),
      }, (responce) => { nn.log(responce) })
    }
  })
}

App.getPID = (project) => {
  if (!project) return
  let pid = project.maxPID + 1

  let count = 100000
  while (count-- > 0) {
    const filename = `${project.url}/${pid}.json`
    if (!fs.existsSync(filename)) {
      project.maxPID = pid
      return pid
    }
    pid += 1
  }
  return null
}

App.savePage = (project, page, callback) => {
  if (!project || !page) return

  const filename = `${project.url}/${page.pid}.json`
  fs.writeFile(filename, page.stringify(), 'utf8', callback)
}

App.loadPage = (project, page, callback) => {
  if (!project || !page) return

  const filename = `${project.url}/${page.pid}.json`
  if (fs.existsSync(filename)) {
    nn.log('loadPage', page.pid, '...')
    fs.readFile(filename, 'utf8', callback)
  } else {
    callback(`${filename} ` + T('File not found.'))
  }
}

App.saveProject = (project, callback) => {
  if (!project || !project.url) return

  const filename = `${project.url}/0.namenote`
  fs.writeFile(filename, project.stringify(), 'utf8', callback)
}

App.loadProject = (url, callback) => {
  const filename = `${url}/0.namenote`
  fs.readFile(filename, 'utf8', (err, json) => {
    if (!err) {
      const data = JSON.parse(json)
      callback(data)
      
    } else {
      App.showMessageBox({
	type: 'error',
	message: `"${filename}" ` + T('File not found.'),
      }, (responce) => { nn.log(responce) })
    }
  })
}

App.showMessageBox = (options, callback) => {
  dialog.showMessageBox(options, callback)
}

App.rebuildMenu = (data) => ipcRenderer.send('rebuild-menu', JSON.stringify(data))
App.setTitle = (data) => {
  ipcRenderer.send('set-title', data)
}

App.setPause = (data) => ipcRenderer.send('set-pause', data)
App.runMain = (message, data) => ipcRenderer.send(message, data)

App.fs = {}
App.fs.createReadStream = (filename) => fs.createReadStream(filename)
App.fs.createWriteStream = (filename) => fs.createWriteStream(filename)

App.csnf = {}
App.csnf.write = (project, filename, callback) => {
  if (!fs.existsSync(filename)) {
    CSNF.write(project, filename, callback)
    
  } else {
    App.showMessageBox({
      type: 'error',
      message: T(`Duplicate file name.`),
    }, (responce) => { nn.log(responce) })
  }
}

App.pdf = {}
App.pdf.write = (project, filename, callback) => {
  if (!fs.existsSync(filename)) {
    PDF.write(project, filename, callback)
    
  } else {
    App.showMessageBox({
      type: 'error',
      message: T(`Duplicate file name.`),
    }, (responce) => { nn.log(responce) })
  }
}

////////////////////////////////////////////////////////////////


export { App }





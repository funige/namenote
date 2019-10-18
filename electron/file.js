'use strict'

const { app, dialog, ipcMain } = require('electron')
const fs = require('fs')


ipcMain.on('openNew', (event, data) => {
  let path = data.path
  if (!path || !fs.existsSync(path)) path = app.getPath('home')
  const name = getDefaultName(path, T('Untitled'))
  event.sender.send('reply', {hoge:'hoge', funi:'funi', defaultName:name})
})

ipcMain.on('searchFolder', (event, data) => {
  const path = data.path
  const name = data.name

  openParams.title = T('Open')
  openParams.defaultPath = path
  event.returnValue = "ok"
  
  setTimeout(() => {
    dialog.showOpenDialog(win, openParams, (filenames) => {
      if (filenames) {
	const path = filenames[0]
	const name = getDefaultName(path, T('Untitled'))
	run(`namenote.ui.openNewDialog.onSearchFolder({name:"${name}", path:"${path}"})`)
      }
    })
  }, 0) 
})

ipcMain.on('createFolder', (event, data) => {
  const url = `${data.path}/${data.name}`
  fs.mkdirSync(url) // ここのエラーにも対応しないと
  event.returnValue = "ok"

  setTimeout(() => {
    run(`namenote.ui.openNewDialog.onCreateFolder("${url}")`)
  }, 0)
})

////////////////////////////////////////////////////////////////

ipcMain.on('fixPath', (event, data) => { // {path, name}
  const path = 'hoge'
  const name = 'funi'
  event.sender.send('reply', {path: path, name: name})
})

ipcMain.on('selectPath', (event, data) => { // {path, name}
  const path = 'hogehoge'
  const name = 'funifuni'
  event.sender.send('reply', {path: path, name: name})
})

////////////////////////////////////////////////////////////////

ipcMain.on('savePage', (event, data) => {
  event.returnValue = "ok"

  setTimeout(() => {
    run(`namenote.project.savePageFinished({url:"xxx", pid:"xxx"})`)
  }, 0)
})

ipcMain.on('saveProject', (event, data) => {
  event.returnValue = "ok"

  setTimeout(() => {
    run(`namenote.project.saveProjectFinished({url:"xxx"})`)
  }, 0)
})

const getDefaultName = (path, name) => {
  let index = 1
  let filename
  while (true) {
    filename = (index <= 1) ? name : name + index
    if (!fs.existsSync(`${path}/${filename}`)) {
      break
    }
    index++
  }
  return filename
}


'use strict'

const { ipcMain, Menu } = require('electron')


function getMenuTemplate (template) {
  for (let item of template) {
    if (item.label) item.label = T(item.label)
    if (item.click) item.click = fixCommand(item)
    if (item.data) delete(item.data)
    
    if (item.submenu) {
      item.submenu = getMenuTemplate(item.submenu)
    }
  }
  return template
}

function fixCommand (item) {
  let script = `namenote.command.do('${item.click}', '${item.data}')`
  return () => run(script)
}

ipcMain.on('rebuild-menu', (event, arg) => {
  const template = getMenuTemplate(JSON.parse(arg))
  Menu.setApplicationMenu(Menu.buildFromTemplate(template))
  event.returnValue = "ok"
})




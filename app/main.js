'use strict'

require('./menu.js')
require('./file.js')

const { app, BrowserWindow, ipcMain } = require('electron')
const fs = require('fs')

const packageData = JSON.parse(fs.readFileSync(`${__dirname}/package.json`));
const name = packageData.name
const debug = packageData.version.match(/debug/i)

let win
let T
let tabletEventReceiver

/**
 *
 * Main Window
 *
 */

function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 750,
    nodeIntegration: false,
    title: '', //'Namenote',
    webPreferences: {
      nodeIntegrationInWorker: true,
      //blinkFeatures: 'PreciseMemoryInfo',
    }
  })
  global.win = win

//  console.log('process=', process.platform, 'arch=', process.arch)

/*
  //  if (process.platform == "win32") {
  if (0) {
    const {TabletEventReceiver} = require("receive-tablet-event")
    tabletEventReceiver = new TabletEventReceiver(win)
    
    const eventNames = ["enterProximity", "leaveProximity", "down", "move", "up"];
    for (const name of eventNames) {
      tabletEventReceiver.on(name, (ev) => {
        if (name.indexOf("Proximity") > 0) {
//       console.log(name);
//       console.log(ev);
        }
        win.webContents.send(`tablet:${name}`, ev);
      });
    }

    win.webContents.executeJavaScript('_hasWintab = true')
  }
*/

  win.setMenu(null)
  win.setAutoHideMenuBar(true)
  
  win.loadURL(`file://${__dirname}/index-desktop.html`)
  if (debug) win.webContents.openDevTools()

  win.on('closed', function () {
    win = null
    if (tabletEventReceiver) {
      tabletEventReceiver.dispose()
    }
  })
}

function getLocaleFunc () {
  const locale = app.getLocale()
  const dictionary = require(`${__dirname}/js/lib/dictionary.js`).dictionary

  for (let key in dictionary) {
    if (locale.indexOf(key) === 0) {
      return (string) => dictionary[key][string] || string
    }
  }
  return (string) => string
}

function run(js) {
  win && win.webContents.executeJavaScript(js)
}

/**
 *
 * App Event Handlers
 *
 */

app.on('ready', function () {
  global.T = getLocaleFunc()
  global.run = run
  
  createWindow()
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  if (win === null) {
    createWindow()
  }
})


/**
 *
 * ipc Event Handlers
 *
 */

ipcMain.on('set-title', (event, arg) => {
  if (win) {
    win.setTitle(arg)
  }
  event.returnValue = "ok"
})

ipcMain.on('quit', (event) => {
  app.quit()
  event.returnValue = "ok"
})

ipcMain.on('developerTools', (event) => {
  win.webContents.toggleDevTools()
  event.returnValue = "ok"
})

ipcMain.on('fullScreen', (event) => {
  win.setFullScreen(!win.isFullScreen())
  event.returnValue = "ok"
})

/*
ipcMain.on('detectTablet', (event, data) => {
  const hasTablet = (tabletEventReceiver) ? true : false
  event.sender.send('reply', {hasTablet: hasTablet})
})
*/


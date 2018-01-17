'use strict'

require('./menu.js')
require('./file.js')

const { app, BrowserWindow, ipcMain } = require('electron')
const {TabletEventReceiver} = require("receive-tablet-event");
const fs = require('fs')

const packageData = JSON.parse(fs.readFileSync(`${__dirname}/package.json`));
const name = packageData.name
const debug = packageData.version.match(/debug/i)

let win
let T


/**
 *
 * Main Window
 *
 */

function createWindow () {
  win = new BrowserWindow({
    width: 1200,
    height: 750,
    nodeIntegration: false, //true,
    title: '', //'Namenote',
    webPreferences: {
      nodeIntegrationInWorker: true,
//    blinkFeatures: 'PreciseMemoryInfo',
    }
  })
  global.win = win

  const receiver = new TabletEventReceiver(win)
  receiver.captureArea = {
    left: 0, top: 0, width: 100, height: 100
  };
  console.log('receiver setup finished?', receiver)

  const eventNames = ["enterProximity", "leaveProximity", "down", "move", "up"];
  for (const name of eventNames) {
    receiver.on(name, (ev) => {
      console.log(name);
      console.log(ev);
      win.webContents.send(`tablet:${name}`, ev);
    });
  }

  
  win.loadURL(`file://${__dirname}/index-desktop.html`)
  if (debug) win.webContents.openDevTools()

  win.on('closed', function () {
    win = null
    receiver.dispose()
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

//ipcMain.on("tablet:install", (ev, captureArea) => {
//  receiver.captureArea = captureArea;
//  console.log('tablet installed!!!', captureArea)
//});

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




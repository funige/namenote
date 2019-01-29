'use strict'

import { config } from './config.es6'
import { shortcut } from './shortcut.es6'
import { recentURL } from './recent-url.es6'

import { command } from './command.es6'
import { ui } from './ui.es6'

import { mainView } from './main-view.es6'
import { pageView } from './page-view.es6'
import { textView } from './text-view.es6'

import { projectManager } from './project-manager.es6'

////////////////////////////////////////////////////////////////

class Namenote {
  constructor() {
    this.version = "2.0.0-alpha.2-debug"
    this.trial = false

    this.config = config
    this.shortcut = shortcut
    this.recentURL = recentURL
    
    this.command = command
    this.ui = ui

    this.mainView = mainView
    this.pageView = pageView
    this.textView = textView
    
    this.projectManager = projectManager
  }

  init() {
    config.load()
    shortcut.load()
    recentURL.load()
    
    ui.init()

    mainView.init()
    pageView.init()
    textView.init()
    
    this.initBaseHandlers()
  }

  initBaseHandlers() {
    window.onresize = (e) => {
      setTimeout(function() {
        log('onresize',
            document.body.clientWidth,
            document.body.clientHeight);
      }, 100)
    }

    window.oncontextmenu = (e) => {
      log('contextmenu')
    }
  }

  /*
  preventScrollFreeze(view) {
    const scroller = $(view.element).parent()
    view.lastY = 0

    scroller.on('touchstart', function(e) {
      view.lastY = e.touches[0].clientY
      log('start')
    })
    
    scroller.on('touchmove', function(e) {
      const top = e.touches[0].clientY
      const scrollTop = $(e.currentTarget).scrollTop()
      const direction = (view.lastY - top) < 0 ? 'up': 'down'
      log(direction)
    })
  }
  */  

  isMac() {
    return navigator.platform.indexOf('Mac')
  }
}

const namenote = new Namenote()

export { namenote }
    

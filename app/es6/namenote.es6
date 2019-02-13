'use strict'

import { config } from './config.es6'
import { shortcut } from './shortcut.es6'
import { recentURL } from './recent-url.es6'

import { command } from './command.es6'
import { ui } from './ui.es6'
import { flash } from './flash.es6'

import { mainView } from './main-view.es6'
import { pageView } from './page-view.es6'
import { textView } from './text-view.es6'

import { projectManager } from './project-manager.es6'

////////////////////////////////////////////////////////////////

class Namenote {
  constructor() {
    this.version = "2.0.0-alpha.3-debug"
    this.trial = false

    this.config = config
    this.shortcut = shortcut
    this.recentURL = recentURL
    this.command = command
    this.projectManager = projectManager

    this.ui = ui
    this.mainView = mainView
    this.pageView = pageView
    this.textView = textView
  }

  init() {
    config.load()
    shortcut.load()
    recentURL.load()

    ui.init()
    mainView.init($('.main-view')[0])
    pageView.init($('.page-view')[0])
    textView.init($('.text-view')[0])

    this.initBaseHandlers()
    flash.load()
  }

  initBaseHandlers() {
    window.onresize = (e) => {
      setTimeout(function() {
        LOG('onresize',
            document.body.clientWidth,
            document.body.clientHeight);
        ui.update()
      }, 100)
    }

    window.oncontextmenu = (e) => {
      LOG('contextmenu')
      return false
    }
  }

  ////////////////
  
  isMac() {
    return navigator.platform.indexOf('Mac')
  }

  accessToken() {
    if (!this.app) {
      return localStorage.getItem('namenote/raw_token')
    }
    return true
  }
}

const namenote = new Namenote()

export { namenote }
    

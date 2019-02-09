'use strict'

import { config } from './config.es6'
import { shortcut } from './shortcut.es6'
import { recentURL } from './recent-url.es6'

import { command } from './command.es6'
import { ui } from './ui.es6'
import { flash } from './flash.es6'

import { MainView } from './main-view.es6'
import { PageView } from './page-view.es6'
import { TextView } from './text-view.es6'

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
    this.ui = ui
    this.projectManager = projectManager
  }

  init() {
    config.load()
    shortcut.load()
    recentURL.load()

    ui.init()

    this.initBaseHandlers()
    this.mainView = new MainView($('.main-view')[0])
    this.pageView = new PageView($('.page-view')[0])
    this.textView = new TextView($('.text-view')[0])

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

  isMac() {
    return navigator.platform.indexOf('Mac')
  }
}

const namenote = new Namenote()

export { namenote }
    

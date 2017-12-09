'use strict'

import { ui } from './ui.es6'
import { helper } from './helper.es6'
import { config } from './config.es6'
import { command } from './command.es6'
import { shortcut } from './shortcut.es6'

import { Project } from './project.es6'
import { Page } from './page.es6'
import { Controller } from './controller.es6'
import { View } from './view.es6'

//import { PageBuffer } from './page-buffer.es6'
//import { TextBuffer } from './text-buffer.es6'

import { Tool } from './tool.es6'
import { toolBar } from './tool-bar.es6'

import { PenTool } from './pen-tool.es6'
import { EraserTool } from './eraser-tool.es6'
import { ArrowTool } from './arrow-tool.es6'
import { HandTool } from './hand-tool.es6'
import { TextTool } from './text-tool.es6'
import { LineTool } from './line-tool.es6'

import { Trial } from './trial.es6'
import { Timestamp } from './timestamp.es6'

import { Selection } from './selection.es6'
import { Autosave } from './autosave.es6'
import { debug } from './debug.es6'

import { CSNF } from './csnf.es6'


const namenote = {
  ui: ui,
  helper: helper,
  
  projects: [],
  tools: [],
  
  init: () => {
    config.load()

    shortcut.init()
    shortcut.reset()

    ui.init()
    Controller.init()
    View.init()
    Autosave.init()
    debug.init()
    
    Tool.tools['dummy'] = new Tool()
    Tool.tools['pen'] = new PenTool()
    Tool.tools['eraser'] = new EraserTool()
    Tool.tools['arrow'] = new ArrowTool()
    Tool.tools['hand'] = new HandTool()
    Tool.tools['text'] = new TextTool()
    Tool.tools['line'] = new LineTool()
    Tool.init()
    
    if (namenote.trial) {
      Trial.showMessage()
    }
  },
}

namenote.version = "0.8.1" // Use script/version.sh to update this value
namenote.trial = false

namenote.command = command
namenote.config = config
namenote.shortcut = shortcut

namenote.project = Project
namenote.view = View
namenote.tool = Tool
namenote.selection = Selection
namenote.autosave = Autosave
namenote.debug = debug
//namenote.page = Page
//namenote.controller = Controller

namenote.csnf = CSNF
namenote.timestamp = Timestamp

//namenote.log = console.log.bind(window.console)
namenote.log = () => {}
namenote.warn = console.warn.bind(window.console)
namenote.error = console.error.bind(window.console)


export { namenote }

////////////////////////////////////////////////////////////////

Project.list = namenote.projects

import { config } from './config.js';
import { shortcut } from './shortcut.js';
import { recentURL } from './recent-url.js';
import { controller } from './controller.js';

import { command } from './command.js';
import { action } from './action.js';
import { ui } from './ui.js';
import { dialog } from './dialog.js';
import { flash } from './flash.js';
import { file } from './file.js';
import { history } from './history.js';
import { Text, text } from './text.js';

import { projectManager } from './project-manager.js';
import { toolManager } from './tool-manager.js';

import { MainView } from './main-view.js';
import { NoteView } from './note-view.js';
import { PageView } from './page-view.js';
import { TextView } from './text-view.js';

let maxID = 1;

class Namenote {
  constructor() {
    this.version = require('../package.json').version;
    this.trial = require('../package.json').trial;

    this.config = config;
    this.shortcut = shortcut;
    this.recentURL = recentURL;
    this.controller = controller;
    this.command = command;
    this.action = action;
    this.history = history;

    this.projectManager = projectManager;
    this.toolManager = toolManager;

    this.file = file;
    this.ui = ui;

    this.text = text; // debug
  }

  init() {
    config.load();
    shortcut.load();
    recentURL.load();

    controller.init();
    ui.init();

    this.mainView = new MainView($('.main-view')[0]);
    this.textView = new TextView($('.text-view')[0]);
    this.pageView = new PageView($('.page-view')[0]);
    this.noteView = new NoteView($('.note-view')[0]);

    this.initBaseHandlers();

    flash.load();
  }

  initBaseHandlers() {
    window.onresize = (e) => {
      setTimeout(() => {
        if (dialog.isOpen() && dialog.current.onresize) {
          dialog.current.onresize(e);
          //      } else {
          //        if (this.onResize) this.onResize();
        }
        ui.update();

        if (this.mainView) {
          this.mainView.onresize();
        }
      }, 100);
    };

    window.oncontextmenu = (e) => {
      console.log('contextmenu');
      return false;
    };
  }

  currentProject() {
    return this.mainView && this.mainView.project;
  }

  isMac() {
    return navigator.platform.indexOf('Mac');
  }

  isMobile() {
    return false;
  }

  getUniqueID() {
    return 'p' + maxID++;
  }

  findDuplicateID() {
    $('[id]').each(function () {
      var ids = $('[id="' + this.id + '"]');
      if (ids.length > 1 && ids[0] == this) console.error('Multiple IDs #' + this.id);
    });
  }

  setThumbnailSize(value) {
    if (value && value == config.data.thumbnailSize) return;
    if (!value) value = config.data.thumbnailSize || 'middle';
    config.data.thumbnailSize = value;
    config.save();

    const tmp = [];
    this.projectManager.projects.forEach((project) => {
      project.pids.forEach((pid, index) => {
        if (project.pages[index]) {
          const page = project.pages[index];
          page.updateThumbnail(project);
        }
      });
    });

    this.pageView.loadProject(this.pageView.project);
  }
}

const namenote = new Namenote();

export { namenote };

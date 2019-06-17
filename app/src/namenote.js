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

import { projectManager } from './project-manager.js';

import { MainView } from './main-view.js';
import { NoteView } from './note-view.js';
import { PageView } from './page-view.js';
import { TextView } from './text-view.js';

let maxID = 0;


class Namenote {
  constructor() {
    this.version = '2.0.0-alpha.12-debug';
    this.trial = false;

    this.config = config;
    this.shortcut = shortcut;
    this.recentURL = recentURL;
    this.controller = controller;
    this.command = command;
    this.action = action;
    this.history = history;

    this.projectManager = projectManager;
    this.file = file;
    this.ui = ui;
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
      setTimeout(function () {
        if (dialog.isOpen() && dialog.current.onresize) {
          dialog.current.onresize(e);
        } else {
          LOG('onresize', document.body.clientWidth, document.body.clientHeight);
        }
        ui.update();
      }, 100);
    };

    window.oncontextmenu = (e) => {
      LOG('contextmenu');
      return false;
    };
  }


  //

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
      if (ids.length > 1 && ids[0] == this) console.warn('Multiple IDs #' + this.id);
    });
  }

  setThumbnailSize(value) {
    if (value && value == config.data.thumbnailSize) return;
    if (!value) value = config.data.thumbnailSize || 'middle';
    config.data.thumbnailSize = value;
    config.save();

    const tmp = [];
    this.projectManager.projects.forEach((project) => {
      project.pids().forEach((pid, index) => {
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

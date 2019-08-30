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
import { autosave } from './autosave.js';

import { projectManager } from './project-manager.js';
import { pageManager } from './page-manager.js';
import { toolManager } from './tool-manager.js';

import { MainView } from './main-view.js';
import { NoteView } from './note-view.js';
import { PageView } from './page-view.js';
import { TextView } from './text-view.js';

import { Canvas } from './canvas.js';

let maxID = 1;
const packageJSON = require('../package.json');


class Namenote {
  constructor() {
    this.version = packageJSON.version;
    this.trial = packageJSON.trial;

    this.config = config;
    this.shortcut = shortcut;
    this.recentURL = recentURL;
    this.controller = controller;
    this.command = command;
    this.action = action;
    this.history = history;

    this.projectManager = projectManager;
    this.pageManager = pageManager;
    this.toolManager = toolManager;

    this.file = file;
    this.ui = ui;

    this.Canvas = Canvas; // test
    this.autosave = autosave;
  }

  init() {
    config.load();
    shortcut.load();
    recentURL.load();

    controller.init();
    ui.init();
    autosave.init();
    
    this.mainView = new MainView(document.querySelector('.main-view'));
    this.textView = new TextView(document.querySelector('.text-view'));
    this.pageView = new PageView(document.querySelector('.page-view'));
    this.noteView = new NoteView(document.querySelector('.note-view'));

    this.initBaseHandlers();

    flash.load();
  }

  initBaseHandlers() {
    window.onresize = (e) => {
      setTimeout(() => {
        if (dialog.isOpen() && dialog.current.onresize) {
          dialog.current.onresize(e);
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

  loadProject(project) {
    this.mainView.loadProject(project);
    this.pageView.loadProject(project);
    this.textView.loadProject(project);
    this.noteView.loadProjects();
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
          page.updateThumbnail();
        }
      });
    });

    this.pageView.loadProject(this.pageView.project);
  }

  getHomePath() {
    const path = this.homePath;
    console.log(`getHomePath [${path}]`);
    return path;
  }
}

const namenote = new Namenote();

export { namenote };

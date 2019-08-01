import { namenote } from './namenote.js';
import { locale, T } from './locale.js';
import { dialog } from './dialog.js';
import { file } from './file.js';
import { recentURL } from './recent-url.js';

import { projectManager } from './project-manager.js';
import { PageView } from './page-view.js';
import { Finder } from './finder.js';
import { Form } from './form.js';

// //////////////////////////////////////////////////////////////

class OpenForm extends Form {
  constructor() {
    super();
    this.id = 'open';
  }

  destructor() {
    this.pageView.destructor();
    this.pageView = null;
    this.element = null;
  }

  init() {
    return new Promise((resolve, reject) => {
      const buttons = {};
      buttons[T('Ok')] = () => { resolve(this.saveForm()); };
      buttons[T('Cancel')] = () => { resolve(); };

      const string = locale.translateHTML(`
        <div class='form' style='height:400px;'>
          <center style='height:40px;'>
            <select class='folders'></select>
          </center>
          <ul class='file-list' style='height: calc(100% - 40px);'></ul>
          <ul class='page-view' style='height: calc(100% - 40px); display:none;'></ul>
        </div>`);

      $(this.element).html(`<form id='${this.id}'>${string}</form>`);
      $(this.element).dialog({
        autoOpen: false,
        position: { my: 'center center', at: 'center center' },
        title: T('Open'),
        modal: true,
        width: 550,
        buttons: buttons,
        open: () => {
          // $(this.element).find('.folders').focus()
        }
      });

      const folders = this.element.querySelector('.folders');
      const fileList = this.element.querySelector('.file-list');
      this.finder = new Finder(folders, fileList, null, {
        selected: (url) => {
          this.load(url);
        }
      });

      const preview = this.element.querySelector('.page-view');
      this.pageView = new PageView(preview, {
        thumbnailSize: 'small',
        loaded: (url, projectURL) => {
          this.finder.updateFolders(url, projectURL);
        }
      });

      this.initForm();
      this.load(file.getHome());
    });
  }

  async load(url) {
//  this.hideAll();
    
    const projectURL = await file.getProjectURL(url);
    console.log('load', url, projectURL);
    
    if (projectURL) {
      const project = await projectManager.get(projectURL);
      if (project) {
        this.pageView.loadProject(project);
        this.showPageView();
      }
    } else {
      this.finder.loadFolder(url);
      this.showFileList();
    }
  }

  // //////////////

  initForm() {}

  saveForm() { return this.pageView.project; }

  showPageView() {
    $(this.element).find('.page-view').show();
    $(this.element).find('.file-list').hide();
    this.enable();
  }

  showFileList() {
    $(this.element).find('.file-list').show();
    $(this.element).find('.page-view').hide();
    this.disable();
  }

  hideAll() {
    $(this.element).find('.file-list').hide();
    $(this.element).find('.page-view').hide();
    this.disable();
  }
}

export { OpenForm };

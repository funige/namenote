import { dialog } from './dialog.js';
import { Project } from './project.js';
import { Page } from './page.js';
import { projectManager } from './project-manager.js';

import { LocalFileSystem } from './local-file-system.js';
import { DropboxFileSystem } from './dropbox-file-system.js';

import { MessageForm } from './message-form.js';
import { OpenForm } from './open-form.js';
import { OpenNewForm } from './open-new-form.js';

import { SaveImageForm } from './save-image-form.js';
import { ExportPDFForm } from './export-pdf-form.js';
import { ExportCSNFForm } from './export-csnf-form.js';
import { PDF } from './pdf.js';
import { CSNF } from './csnf.js';
import { namenote } from './namenote.js';

// //////////////////////////////////////////////////////////////

class File {
  constructor() {
    this.systems = {};
  }

  async openDialog() {
    const fileSystem = this.getFileSystem(this.getDefaultScheme());
    if (!fileSystem.auth('openDialog')) return;

    const project = await dialog.open(new OpenForm());
    dialog.close();

    if (project) {
      namenote.loadProject(project);
    }
  }

  async open(url) {
    const fileSystem = this.getFileSystem(this.getScheme(url));
    if (!fileSystem.auth('open', url)) return;

    const projectURL = await this.getProjectURL(url);
    if (projectURL) {
      const project = await projectManager.get(projectURL);
      namenote.loadProject(project);
    }
  }

  async saveImageDialog() {
    const url = await dialog.open(new SaveImageForm());
    dialog.close();
    if (url) {
      console.log('save page image to', url);
      /*
      const project = namenote.currentProject()
      if (project) {
        project.pages[0].capture((data) => {
          if (data) {
            this.save(url, data)
          }
        })
      }
      */
    }
  }

  async exportPDFDialog() {
    const project = namenote.currentProject();
    const form = new ExportPDFForm(project);
    const result = await dialog.open(form);

    if (result) {
      const pdf = new PDF(project, { monitor: form });
      pdf.write(result, () => {
        console.log('export pdf', result);
        dialog.close();
      });
    }
  }

  async exportCSNFDialog() {
    const project = namenote.currentProject();
    const form = new ExportCSNFForm(project);
    const result = await dialog.open(form);

    if (result) {
      const csnf = new CSNF(project, { monitor: form });
      csnf.write(result, () => {
        console.log('export csnf', result);
        dialog.close();
      });
    }
  }

  async openNewDialog() {
    const fileSystem = this.getFileSystem(this.getDefaultScheme());
    if (!fileSystem.auth('openNewDialog')) return;

    const result = await dialog.open(new OpenNewForm());
    dialog.close();
    console.warn(result);

    const project = null; // ここで新規プロジェクト作成……
    if (project) {
      namenote.loadProject(project);
    }
  }

  async logout(scheme) {
    const fileSystem = this.getFileSystem(scheme);
    console.log('logout', scheme, fileSystem);
    fileSystem.logout();
  }

  async readdir(url) {
    return new Promise((resolve, reject) => {
      const fileSystem = this.getFileSystem(this.getScheme(url));
      const path = this.getPath(url);
      fileSystem.readdir(path, (err, dirents) => {
        if (err) {
          return reject(err);
        }
        resolve(dirents);
      });
    });
  }

  async readJSON(url) {
    return new Promise((resolve, reject) => {
      const fileSystem = this.getFileSystem(this.getScheme(url));
      const path = this.getPath(url);
      fileSystem.readFile(path, (err, json) => {
        if (err) {
          return reject(err);
        }
        resolve(JSON.parse(json));
      });
    });
  }

  async writeJSON(url, data) {
    return writeFile(url, JSON.stringify(data));
  }

  async writeFile(url, data) {
    return new Promise((resolve, reject) => {
      const fileSystem = this.getFileSystem(this.getScheme(url));
      const path = this.getPath(url);
      fileSystem.writeFile(path, data, 'base64', (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  async getProjectURL(url) { // Translate "hoge/" -> "hoge/hoge.namenote"
    console.log('getProjectURL', url);
    if (url.match(/\.namenote$/i)) return url;

    try {
      const dirents = await file.readdir(url);
      
      for (const dirent of dirents) {
        if (!dirent.isDirectory() && dirent.name.match(/\.namenote$/i)) {
          return `${url}${dirent.name}`;
        }
      }
    } catch (e) { console.log(e); }
  }

  async getMaxPID(url) {
    try {
      let maxPID = -1;
      const dirents = await file.readdir(url);
      for (const dirent of dirents) {
        if (!dirent.isDirectory() && dirent.name.match(/\.json$/i)) {
          const pid = parseInt(dirent.name);
          if (maxPID < pid) {
            maxPID = pid;
          }
        }
      }
      return maxPID;
    } catch (e) { console.log(e); }
  }

  async getSaveName(name, url) {
    console.log('get save name', name, url);
    const [body, ext] = this.splitName(name);
    try {
      const dirents = await file.readdir(url);
      let index = 0;
      const dotext = (ext) ? `.${ext}` : ''
      while (1) {
        const saveName = (index == 0) ? name : `${body} ${index}${dotext}`
        if (!dirents.find(dirent => dirent.name === saveName)) {
          console.log(saveName);
          return saveName;
        }
        index++;
      }
    } catch (e) { console.log(e); }
  }

  // "url" may contain a storage scheme.
  // "url" = "scheme" + "path"

  getLabel(url) {
    const scheme = this.getScheme(url);
    const path = this.getPath(url);
    const label = this.truncateURL(url);
    return {
      text: label,
      path: path,
      scheme: scheme,
      icon: 'ui-icon-note'
    };
  }

  getScheme(url) {
    const arr = url.split(':');
    return (arr.length > 1 && arr[0]) ? arr[0] : 'file';
  }

  getPath(url) {
    const arr = url.split(':');
    const result = (arr.length > 1) ? arr.slice(1).join(':') : url;
    return result.replace(/^\/+/, '/');
  }

  getFileSystem(scheme) {
    if (!this.systems[scheme]) {
      if (scheme == 'file') {
        this.systems[scheme] = new LocalFileSystem();
      } else if (scheme == 'dropbox') {
        this.systems[scheme] = new DropboxFileSystem();
      }
    }
    return this.systems[scheme];
  }

  getDefaultScheme() {
    return (namenote.app) ? 'file' : 'dropbox';
  }

  getHome(type) {
    if (namenote.app) {
      return `file://${namenote.homePath}/`;
    }

    if (type === 'export') return 'dropbox:///Exports/';
    if (type === 'note') return 'dropbox:///Notes/';
    return 'dropbox:///';
  }

  truncateURL(url) {
    url = url.replace(/[^/]*\.namenote$/, '');
    url = url.replace(/\/$/, '');
    url = url.replace(/^.*\//, '');
    return url;
  }

  splitName(name) {
    const arr = name.split('.');
    const ext = (arr.length > 1) ? arr.pop() : null;
    const body = arr.join('.');
    return [body, ext];
  }
}

const file = new File();

export { file };

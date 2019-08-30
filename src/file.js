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
import { svgRenderer } from './svg-renderer.js';
import { ExportPDFForm } from './export-pdf-form.js';
import { ExportCSNFForm } from './export-csnf-form.js';
import { PDF } from './pdf.js';
import { CSNF } from './csnf.js';
import { namenote } from './namenote.js';

//

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
    const project = namenote.currentProject();
    if (!project) return;
    const page = project.currentPage;
    if (!page) return;

    const url = await dialog.open(new SaveImageForm());

    if (url) {
      console.log('save page image to', url);
      svgRenderer.capture(page, (png) => {
        if (png) {
          const body = png.replace(/^data:image\/png;base64,/, '');
          this.writeFile(url, body).then((err) => {
            console.log('image saved..');
          });
        }
        dialog.close();
      });
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

    const project = await projectManager.create(result);
    console.log('openNewDialog:', project);
    if (project) {
      namenote.loadProject(project);
    }
  }

  async logout(scheme) {
    const fileSystem = this.getFileSystem(scheme);
    console.log('logout', scheme, fileSystem);
    fileSystem.logout();
  }

  async mkdir(url) {
    return new Promise((resolve, reject) => {
      const fileSystem = this.getFileSystem(this.getScheme(url));
      const path = this.getPath(url);
      fileSystem.mkdir(path, (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
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
    return this.writeFile(url, JSON.stringify(data), 'utf8');
  }

  async writeFile(url, data, type) {
    if (type === undefined) type = 'base64';

    return new Promise((resolve, reject) => {
      const fileSystem = this.getFileSystem(this.getScheme(url));
      const path = this.getPath(url);
      fileSystem.writeFile(path, data, type, (err) => {
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
      let maxPID = 0;
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
    } catch (e) {
      console.log(e);
      return 0;
    }
  }

  async getSaveName(name, url) {
    console.log('get save name', name, url);
    const [body, ext] = this.splitName(name);

    try {
      const dirents = await file.readdir(url);
      let index = 0;
      const dotext = (ext) ? `.${ext}` : '';

      while (1) {
        const saveName = (index == 0) ? name : `${body} ${index}${dotext}`;
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

    let result = url;
    if (arr.length > 1) {
      arr[1] = arr[1].replace(/^\/+/, '');
      result = arr.slice(1).join(':');
    }
    console.log('getPath', arr, result.replace(/^\/+/, '/'));
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
    console.log('getFileSystem', scheme);
    return this.systems[scheme];
  }

  getDefaultScheme() {
    return (namenote.app) ? 'file' : 'dropbox';
  }

  getHome(type) {
    if (namenote.app) {
      const homePath = namenote.getHomePath();
      return `file://${homePath}/`;
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

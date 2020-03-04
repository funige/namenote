import { dialog } from './dialog.js';
import { Project } from './project.js';
import { Page } from './page.js';
import { projectManager } from './project-manager.js';

import { LocalAdapter } from './local-adapter.js';
import { DropboxAdapter } from './dropbox-adapter.js';

import { MessageForm } from './message-form.js';
import { OpenForm } from './open-form.js';
import { OpenNewForm } from './open-new-form.js';


import { DownloadImageForm } from './download-image-form.js';
import { SaveImageForm } from './save-image-form.js';
import { svgRenderer } from './svg-renderer.js';
import { ExportPDFForm } from './export-pdf-form.js';
import { ExportCSNFForm } from './export-csnf-form.js';
import { PDF } from './pdf.js';
import { CSNFExporter } from './csnf-exporter.js';
import { namenote } from './namenote.js';

// "url" may contain a storage scheme. ("file" or "dropbox")
// <url> = <scheme>:<path>

class File {
  constructor() {
    this.adapters = {};
  }

  async openDialog() {
    const adapter = this.getAdapter(this.getDefaultScheme());
    if (!adapter) return;

    const project = await dialog.open(new OpenForm());
    dialog.close();

    if (project) {
      namenote.loadProject(project);
    }
  }

  async open(url) {
    const adapter = this.getAdapter(this.getScheme(url));
    if (!adapter) return;

    const projectURL = await this.getProjectURL(url);

    if (projectURL) {
      const project = await projectManager.get(projectURL);
      namenote.loadProject(project);
    }
  }

  async downloadImageDialog() {
    const project = namenote.currentProject();
    if (!project) return;
    const page = project.currentPage;
    if (!page) return;
    const result = await dialog.open(new DownloadImageForm(page));
    dialog.close();
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
            dialog.close();
          });
        }
      });
    } else {
      console.log('save image canceled.');
      dialog.close();
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
    } else {
      console.log('export pdf canceled.');
      dialog.close();
    }
  }

  async exportCSNFDialog() {
    const project = namenote.currentProject();
    const form = new ExportCSNFForm(project);
    const result = await dialog.open(form);

    if (result) {
      const csnf = new CSNFExporter(project, { monitor: form });
      await csnf.write(result)
      console.log('export csnf', result);
      dialog.close();

    } else {
      console.log('export csnf canceled.');
      dialog.close();
    }
  }

  async openNewDialog() {
    const adapter = this.getAdapter(this.getDefaultScheme());
    if (!adapter) return;

    const result = await dialog.open(new OpenNewForm());
    dialog.close();
    console.warn(result);

    if (result) {
      const project = await projectManager.create(result);
      console.log('openNewDialog:', project);
      if (project) {
        namenote.loadProject(project);
      }
    }
  }

  async logout(scheme) {
    const adapter = this.getAdapter(scheme);
    if (adapter) {
      adapter.logout();
    }
  }

  async getHash(url) {
    const adapter = this.getAdapter(this.getScheme(url));
    if (!adapter) return;

    const path = this.getPath(url);
    return await adapter.getHash(path);
  }
  
  async mkdir(url) {
    const adapter = this.getAdapter(this.getScheme(url));
    if (!adapter) return;
    
    const path = this.getPath(url);
    await adapter.mkdir(path);
  }

  async readdir(url) {
    const adapter = this.getAdapter(this.getScheme(url));
    if (!adapter) return;

    const path = this.getPath(url);
    return await adapter.readdir(path);
  }

  async readJSON(url) {
    const data = await this.readFile(url);
    return JSON.parse(data);
  }

  async readFile(url) {
    const adapter = this.getAdapter(this.getScheme(url));
    if (!adapter) return;
    
    const path = this.getPath(url);
    return await adapter.readFile(path);
  }

  async writeJSON(url, data) {
    return await this.writeFile(url, JSON.stringify(data), 'utf8');
  }

  async writeFile(url, data, type = 'base64') {
    const adapter = this.getAdapter(this.getScheme(url));
    if (!adapter) return;

    const path = this.getPath(url);
    return adapter.writeFile(path, data, type);
  }

  // Translate "hoge/" -> "hoge/hoge.namenote"
  async getProjectURL(url) {
    if (url.match(/\.namenote$/i)) return url;

    const dirents = await this.readdir(url);
    for (const dirent of dirents) {
      if (!dirent.isDirectory() && dirent.name.match(/\.namenote$/i)) {
        console.log(`getProjectURL ${url} -> ${url}${dirent.name}`);
        return `${url}${dirent.name}`;
      }
    }
  }

  async getMaxPID(url) {
    let maxPID = 0;

    const dirents = await this.readdir(url);
    for (const dirent of dirents) {
      if (!dirent.isDirectory() && dirent.name.match(/\.json$/i)) {
        const pid = parseInt(dirent.name);
        if (maxPID < pid) {
          maxPID = pid;
        }
      }
    }
    return maxPID;
  }

  // "Untitled.ext" => "Untitled 1.ext"
  async getSaveName(name, url) {
    const [body, ext] = this.splitName(name);
    const dotext = (ext) ? `.${ext}` : '';
    let index = 0;

    const dirents = await this.readdir(url);
    while (1) {
      const saveName = (index == 0) ? name : `${body} ${index}${dotext}`;
      if (!dirents.find(dirent => dirent.name === saveName)) {
        return saveName;
      }
      index++;
    }
  }

  // Get display name for url
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
      // when arr[1] is drive name (like '//C')
      if (arr.length > 2) {
        arr[1] = arr[1].replace(/^\/+/, '');
      }
      result = arr.slice(1).join(':');
    }
    return result.replace(/^\/+/, '/');
  }

  getAdapter(scheme) {
    if (!this.adapters[scheme]) {
      switch (scheme) {
        case 'file':
          this.adapters[scheme] = new LocalAdapter();
          break;
        case 'dropbox':
          this.adapters[scheme] = new DropboxAdapter();
          break;
      }
    }
    const adapter = this.adapters[scheme];
    if (adapter.auth()) {
      adapter.showAuthDialog();
      return null;
    }
    return adapter;
  }

  getDefaultScheme() {
    if (namenote.app) {
      return 'file';
    } else {
      return 'dropbox';
    }
  }

  getHome(type) {
    if (namenote.app) {
      const homePath = namenote.getHomePath();
      return `file://${homePath}/`;
    }
    //if (type === 'export') return 'dropbox:///Exports/';
    //if (type === 'note') return 'dropbox:///Notes/';
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


/*
   async getHash(path) {
   fileSystem 
   }

   async writeFileWithHash(url, data, hash) {
   const fileSystem = this.getFileSystem(this.getScheme(url));
   const path = this.getPath(url);
   const hash = await fileSystem.getHash(path);
   if (hash) {
   const currentHash = await this.getHash(url);
   if (currentHash !== hash) {
   throw new Error("file modified");
   }
   }

   await this.writeFile(url, data)
   this.hashes[hash] = await this.getHash(url);
   }
 */

/*
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
 */


import { namenote } from './namenote.js';
import { T } from './locale.js';
import { FileSystem } from './file-system.js';

import { flash } from './flash.js';
import { dialog } from './dialog.js';

import { MessageForm } from './message-form.js';

const packageJSON = require('../package.json');


class DropboxFileSystem extends FileSystem {
  constructor() {
    super();
    this.type = 'dropbox';
  }

  // //////////////

  stat(url, callback) {
    if (!this.auth()) return;
    return this.fs.stat(url, callback);
  }

  readdir(url, callback) {
    if (!this.auth()) return;
    return this.fs.readdir(url, { mode: 'stat' }, callback);
  }

  readFile(url, callback) {
    if (!this.auth()) return;
    return this.fs.readFile(url, 'utf8', callback);
  }

  writeFile(url, data, encoding, callback) {
    if (!this.auth()) return;
    if (arguments.length < 4) {
      callback = encoding;
      encoding = 'utf8';
    }
    return this.fs.writeFile(url, data, encoding, callback);
  }

  //

  auth(item, data) {
    const accessToken = localStorage.getItem('namenote/raw_token');
    if (accessToken) {
      if (!this.fs) {
        this.fs = require('dropbox-fs')({ apiKey: accessToken });
        this.initFolders();
      }
      return true;
    }

    dialog.open(new MessageForm(), {
      title: 'Authenticate',
      message: 'Namenote would like access to the files in your Dropbox.',
      ok: 'Connect to Dropbox',
      cancel: 'Cancel'

    }).then((responce) => {
      if (responce) {
        dialog.current.showProgress(T('Connecting ...'));

        var Dropbox = require('dropbox').Dropbox;
        var dbx = new Dropbox({ clientId: 'cex5vkoxd9nwj48' });
        var authUrl = (location.href.indexOf('localhost') < 0)
          ? packageJSON.authURL
          : 'http://localhost:8080/namenote/auth';

        flash.save(item, data);
        location.href = dbx.getAuthenticationUrl(authUrl);
      } else {
        dialog.close();
      }
    });
    return false;
  }

  logout() {
    this.fs = null;
    localStorage.removeItem('namenote/raw_token');
    dialog.open(new MessageForm(), {
      title: 'Logout',
      ok: 'Ok',
      message: 'Disconnected.'

    }).then(() => {
      dialog.close();
    });
  }

  initFolders() {
    this.readdir('/', (err, dirents) => {
      if (!err) {
        const notes = dirents.find(dirent => dirent.name.match('Notes'));
        if (!notes) this.fs.mkdir('/Notes', (err) => {
          const exports = dirents.find(dirent => dirent.name.match('Exports'));
          if (!exports) this.fs.mkdir('/Exports', (err) => {
            console.log('init folders');
          });
        });
      }
    });
  }  
}

export { DropboxFileSystem };

import { namenote } from './namenote.js';
import { T } from './locale.js';
import { dialog } from './dialog.js';
import { MessageForm } from './message-form.js';
import dropboxFS from 'dropbox-fs';

const packageJSON = require('../package.json');
const privateJSON = require('../private.json');


class DropboxAdapter {
  constructor() {
    this.type = 'dropbox';
  }

  async getHash(path) {
    const stat = await this.stat(path);
    return stat.content_hash;
  }
  
  async stat(path) {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.stat(path, (err, stat) => {
        if (err) reject(err);
        resolve(stat);
      });
    });
  }

  async mkdir(path) {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.mkdir(path, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  async readdir(path) {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.readdir(path, { mode: 'stat' }, (err, dirents) => {
        if (err) reject(err);
        resolve(dirents);
      });
    });
  }

  async readFile(path) {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.readFile(path, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
  
  async writeFile(path, data, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.writeFile(path, data, encoding, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  auth() {
    const accessToken = localStorage.getItem('namenote/raw_token');
    //const accessToken = "xzg77AnvTaAAAAAAAAAAfyW1J2kjwyCHRtjRZApPm5OOLukQ_qiSPPmXig3WSZVS"
    if (accessToken) {
      if (!this.fs) {
        this.fs = dropboxFS({ apiKey: accessToken });
      }
      return null;
    }
    return new Error('No access token for dropbox.');
  }

  logout() {
    this.fs = null;
    localStorage.removeItem('namenote/raw_token');
  }
  
  showAuthDialog() {
    dialog.open(new MessageForm(), {
      title: 'Authenticate',
      message: 'Namenote would like access to the files in your Dropbox.',
      ok: 'Connect to Dropbox',
      cancel: 'Cancel'

    }).then((responce) => {
      if (responce) {
        dialog.current.showProgress(T('Connecting ...'));

        var Dropbox = require('dropbox').Dropbox;
        var dbx = new Dropbox({ clientId: privateJSON.dropbox.clientId });
        var authUrl = (location.href.indexOf('localhost') < 0)
                    ? packageJSON.authURL
                    : 'http://localhost:8080/auth';

        location.href = dbx.getAuthenticationUrl(authUrl);
      } else {
        dialog.close();
      }
    });
    return false;
  }
}

export { DropboxAdapter };

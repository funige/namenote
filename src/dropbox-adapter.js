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

  async stat(url) {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.stat(url, (err, stat) => {
        if (err) reject(err);
        resolve(stat);
      });
    });
  }

  async mkdir(url) {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.mkdir(url, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  async readdir(url) {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.readdir(url, { mode: 'stat' }, (err, dirents) => {
        if (err) reject(err);
        resolve(dirents);
      });
    });
  }

  async readFile(url) {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.readFile(url, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }
  
  async writeFile(url, data, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      const err = this.auth();
      if (err) reject(err);
      this.fs.writeFile(url, data, encoding, (err) => {
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

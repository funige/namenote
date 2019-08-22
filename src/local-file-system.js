import { FileSystem } from './file-system.js';

// //////////////////////////////////////////////////////////////

class LocalFileSystem extends FileSystem {
  constructor() {
    super();
    this.fs = window.require('fs');
    //  this.fs = require('fs-extra');
    this.type = 'local';
  }

  // //////////////

  stat(url, callback) {
    return this.fs.stat(url, callback);
  }

  mkdir(url, callback) {
    return this.fs.mkdir(url, callback);
  }

  readdir(url, callback) {
    return this.fs.readdir(url, { withFileTypes: true }, callback);
  }

  readFile(url, callback) {
    return this.fs.readFile(url, 'utf8', callback);
  }

  writeFile(url, data, encoding, callback) {
    if (arguments.length < 4) {
      callback = encoding;
      encoding = 'utf8';
    }
    return this.fs.writeFile(url, data, encoding, callback);
  }
}

export { LocalFileSystem };

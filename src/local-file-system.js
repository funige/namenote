import { FileSystem } from './file-system.js';

// //////////////////////////////////////////////////////////////

class LocalFileSystem extends FileSystem {
  constructor() {
    super();
    this.fs = window.require('fs');
    this.type = 'local';
  }

  // //////////////

  stat(url, callback) {
    return this.fs.stat(url, callback);
  }

  readdir(url, callback) {
    return this.fs.readdir(url, { withFileTypes: true }, callback);
  }

  readFile(url, callback) {
    return this.fs.readFile(url, 'utf8', callback);
  }

  writeFile(url, data, callback) {
    return this.fs.writeFile(url, data, 'utf8', callback);
  }
}

export { LocalFileSystem };
class LocalAdapter {
  constructor() {
    this.fs = window.require('fs');
    this.type = 'local';
  }

  async stat(url) {
    return new Promise((resolve, reject) => {
      this.fs.stat(url, (err, stat) => {
        if (err) reject(err);
        resolve(stat);
      });
    });
  }

  async mkdir(url) {
    return new Promise((resolve, reject) => {
      this.fs.mkdir(url, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  
  async readdir(url) {
    return new Promise((resolve, reject) => {
      this.fs.readdir(url, { withFileTypes: true }, (err, dirents) => {
        if (err) reject(err);
        resolve(dirents);
      });
    });
  }

  async readFile(url) {
    return new Promise((resolve, reject) => {
      this.fs.readFile(url, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  async writeFile(url, data, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      this.fs.writeFile(url, data, encoding, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  auth() {
    return null;
  }
  
  /*
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
  }*/
}

export { LocalAdapter };

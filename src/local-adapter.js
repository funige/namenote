class LocalAdapter {
  constructor() {
    this.fs = window.require('fs');
    this.type = 'local';
  }

  async getHash(path) {
    const stat = await this.stat(path);
    return stat.mtimeMs;
  }
  
  async stat(path) {
    return new Promise((resolve, reject) => {
      this.fs.stat(path, (err, stat) => {
        if (err) reject(err);
        resolve(stat);
      });
    });
  }

  async mkdir(path) {
    return new Promise((resolve, reject) => {
      this.fs.mkdir(path, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }
  
  async readdir(path) {
    return new Promise((resolve, reject) => {
      this.fs.readdir(path, { withFileTypes: true }, (err, dirents) => {
        if (err) reject(err);
        resolve(dirents);
      });
    });
  }

  async readFile(path) {
    return new Promise((resolve, reject) => {
      this.fs.readFile(path, 'utf8', (err, data) => {
        if (err) reject(err);
        resolve(data);
      });
    });
  }

  async writeFile(path, data, encoding = 'utf8') {
    return new Promise((resolve, reject) => {
      this.fs.writeFile(path, data, encoding, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  }

  auth() {
    return null;
  }
}

export { LocalAdapter };

'use strict'

////////////////////////////////////////////////////////////////

class FileSystem {
  constructor() {
  }

  init() {
  }

  stat(url, callback) {}
  readdir(url, callback) {}
  
  completePath(url, extension = 'namenote') {
    const regexp = new RegExp(extension + '$', 'i')

    return new Promise((resolve, reject) => {
      this.stat(url, (err, stats) => {
        if (err) throw err
        if (stats.isFile()) {
          resolve(url)

        } else {
          this.readdir(url, (err, dirents) => {
            if (err) throw err
            for (const dirent of dirents) {
              if (!dirent.isDirectory() && dirent.name.match(regexp)) {
                return resolve(`${url}/${dirent.name}`)
              }
            }
            throw('File open error.')
          })
        }
      })
    })
  }
}

export { FileSystem }

import { configDefault } from './config-default.js'

class Config {
  constructor() {
    this.data = []
  }

  load() {
    const json = localStorage.getItem('namenote/config')
    this.data = (json) ? JSON.parse(json) : $.extend(true, {}, configDefault)
  }

  save() {
    const json = JSON.stringify(this.data)
    localStorage.setItem('namenote/config', json)
  }

  resetStorage() {
    this.data = Object.assign({}, configDefault)
    this.save()
  }

  getValue(key, defaultValue) {
    if (this.data[key] !== undefined) {
      return this.data[key]

    } else {
      return defaultValue
    }
  }
}

const config = new Config()

export { config }

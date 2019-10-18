import { configDefault } from './config-default.js';

class Config {
  constructor() {
    this.data = [];
  }

  load() {
    const json = localStorage.getItem('namenote/config');
    this.data = (json) ? JSON.parse(json) : $.extend(true, {}, configDefault);
  }

  save() {
    const json = JSON.stringify(this.data);
    localStorage.setItem('namenote/config', json);
  }

  resetStorage() {
    this.data = Object.assign({}, configDefault);
    this.save();
  }

  getValue(key) {
    if (this.data[key] !== undefined) {
      return this.data[key];
    }
    return configDefault[key];
  }

  updateValue(key, value) {
    const oldValue = this.getValue(key);
    if (value !== oldValue) {
      this.data[key] = value;
      this.save();
      return true; // changed
    }
    return false; // not changed
  }
}

const config = new Config();

export { config };

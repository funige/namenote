import { projectManager } from './project-manager.js';
import { menu } from './menu.js';

const MAX_RECENT_URL = 10;


class RecentURL {
  constructor() {
    this.data = [];
  }

  load() {
    const json = localStorage.getItem('namenote/recent-url');
    this.data = (json) ? JSON.parse(json) : [];
  }

  save() {
    const json = JSON.stringify(this.data);
    localStorage.setItem('namenote/recent-url', json);
  }

  resetStorage() {
    this.data = [];
    this.save();
    menu.update();
  }

  add(url) {
    this.data = this.data.filter((value) => value != url);
    this.data.unshift(url);

    if (this.data.length > MAX_RECENT_URL) {
      this.data.length = MAX_RECENT_URL;
    }
    this.save();
  }
}

const recentURL = new RecentURL();

export { recentURL };

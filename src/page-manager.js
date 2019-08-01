import { namenote } from './namenote.js';
import { Project } from './project.js';
import { Page } from './page.js';
import { file } from './file.js';


class PageManager {
  constructor() {
    this.pages = {};
  }

  get(project, pid) {
    let page = this.find(project, pid);
    if (!page) {
      page = new Page(project, pid);
      this.addPage(page);
    }
    return page;
  }

  find(project, pid) {
    const url = project.url;
    if (this.pages[url]) {
      return this.pages[url][pid];
    }
    return null;

    // return this.pages.find(page => {
    //  return (page.project === project) && (page.pid === pid);
    // });
  }

  addPage(page) {
    const url = page.project.url;
    const pid = page.pid;
    if (!this.pages[url]) {
      this.pages[url] = {};
    }
    this.pages[url][pid] = page;

    // this.pages.push(page);
  }
}

const pageManager = new PageManager();

export { pageManager };

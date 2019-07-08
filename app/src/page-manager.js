import { namenote } from './namenote.js';
import { Project } from './project.js';
import { Page } from './page.js';
import { file } from './file.js';


class PageManager {
  constructor() {
    this.pages = [];
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
    return this.pages.find(page => ((page.project === project)
                                    && (page.pid === pid)));
  }

  addPage(page) {
    this.pages.push(page);
  }
}

const pageManager = new PageManager();

export { pageManager };

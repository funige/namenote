import { Page } from './page.js';
import { autosave } from './autosave.js';


class PageManager {
  constructor() {
    this.pages = {};
  }

  async create(project) {
    const pid = await project.getNewPID();
    const page = new Page(project, pid, true);

    this.addPage(page);
    autosave.push(page);
    return page;
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

  removePagesForURL(url) {
    const pagesForProject = this.pages[url];
    Object.keys(pagesForProject).forEach(pid => {
      pagesForProject[pid].destructor();
    });
    this.pages[url] = null;
  }
}

const pageManager = new PageManager();

export { pageManager };

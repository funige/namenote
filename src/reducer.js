import { projectManager } from './project-manager.js';
import { pageManager } from './page-manager.js';

class Reducer {
  movePage(from, to, url) {
    const project = projectManager.find(url);
    const page = project.pages.splice(from, 1)[0];
    project.pages.splice(to, 0, page);
  }

  addPage(pid, to, url) {
    const project = projectManager.find(url);
    const page = pageManager.get(project, pid);
    project.pages.splice(to, 0, page);
    project.setCurrentPage(pageManager.find(project, pid));
  }

  removePage(pid, from, url) {
    const project = projectManager.find(url);
    project.pages.splice(from, 1);

    if (project.pages.length > 0) {
      const index = (from > 0) ? (from - 1) : 0;
      project.setCurrentPage(project.pages[index]);
    }
  }

  moveText(from, to, fromPID, toPID, url) {
    const project = projectManager.find(url);
    const fromPage = pageManager.find(project, fromPID);
    const toPage = pageManager.find(project, toPID);
    if (!fromPage || !toPage) return;

    const text = fromPage.texts[from];
    fromPage.texts.splice(from, 1);
    toPage.texts.splice(to, 0, text);
  }

  addText(text, to, toPID, url) {
    const project = projectManager.find(url);
    const toPage = pageManager.find(project, toPID);
    if (!toPage) return;

    toPage.texts.splice(to, 0, text);
    project.setCurrentKey(text.key);
  }

  removeText(text, from, fromPID, url) {
    const project = projectManager.find(url);
    const fromPage = pageManager.find(project, fromPID);
    if (!fromPage) return;

    fromPage.texts.splice(from, 1);
    if (fromPage.texts.length > 0) {
      const index = (from > 0) ? from - 1 : 0;
      project.setCurrentKey(fromPage.texts[index].key);
    }
  }
  
  editText(toText, index, pid, url) {
    const project = projectManager.find(url);
    const page = pageManager.find(project, pid);
    if (!page) return;

    page.texts[index] = toText;
  }

  editImage(toImage, rect, pid, url) {
    const project = projectManager.find(url);
    const page = pageManager.find(project, pid);
    if (!page) return;

    page.putImage(rect, toImage);
    page.updateThumbnail();
  }
}

const reducer = new Reducer();

export { reducer };

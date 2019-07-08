
class View {
  constructor(element, options) {
    this.element = element;
    this.options = options || {};
  }

  destructor() {
    LOG(`view destructor ${this.id}`);
    this.element = null;
    this.options = null;

    this.projects = null;
    this.pageData = {};
  }

  loadProject(project) {
    if (this.project) this.project.removeView(this);
    this.project = project;
    if (!project) return;
    project.addView(this);

    if (this.element) {
      this.element.alt = project.url;
    }
  }

  enableSmoothScroll(element) {
    element.parentNode.style.WebkitOverflowScrolling = 'touch';
    element.style.WebkitPerspective = '0';
  }

  createButtonElement() {
    const li = document.createElement('li');
    return li;
  }

  createFrame() {
    const frame = document.createElement('div');
    frame.className = 'frame';
    return frame;
  }

  createCanvas(page, width, height) {
    const canvas = document.createElement('canvas');
    canvas.width = (width !== undefined) ? width : page.width;
    canvas.height = (height !== undefined) ? height : page.height;
    return canvas;
  }

  createTexts(page, text) {
    const texts = document.createElement('div');
    texts.innerHTML = (text !== undefined) ? text : page.texts.innerHTML;
    return texts;
  }

  isDialog() {
    return false;
  }

  detectPID(element) {
    while (element) {
      if (element.classList.contains('page')) {
        return parseInt(element.id.replace(/^(pageview-|textview-)?page-/, ''), 10);
      }
      element = element.parentNode;
    }
    return null;
  }

  // Default update methods

  onMovePage(from, to) {
    LOG('move page', from, to);
    this.loadProject(this.project);
  }

  onMoveText(from, to, fromPID, toPID) {
    LOG('move text', from, to, fromPID, toPID);
    this.loadProject(this.project);
  }

  onAddPage(pid, to) {
    LOG('add page', pid, to);
    this.loadProject(this.project);
  }

  onRemovePage(from) {
    LOG('remove page', from);
    this.loadProject(this.project);
  }

  onAddText(text, to, toPID) {
    LOG('add text', text, to, toPID);
    this.loadProject(this.project);
  }

  onRemoveText(from, fromPID) {
    LOG('remove text', from, fromPID);
    this.loadProject(this.project);
  }

  onEditText(toText, index, pid) {
    LOG('edit text', toText, index, pid);
    this.loadProject(this.project);
  }

  onSetCurrentPage(pid) {
  }

  onClearCurrentPage() {
  }

  onAddCurrentText(tid) {
  }

  onClearCurrentText() {
  }
}

export { View };

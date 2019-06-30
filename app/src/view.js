
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
    LOG('pageView loadProject', project.url);
    if (this.project) this.project.removeView(this);
    this.project = project;
    if (!project) return;
    project.addView(this);

    this.element.alt = project.url
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
    canvas.width = width || page.width;
    canvas.height = height || page.height;
    return canvas;
  }

  createTexts(page, text) {
    const texts = document.createElement('div');
    texts.innerHTML = text || page.params.text;
    return texts;
  }

  isDialog() {
    return false;
  }

  /*
  showCurrentPage(pid) {
    const oldPID = this.project.currentPage;
    if (!pid) pid = oldPID;
    
    const oldPD = this.pageData[oldPID];
    const newPD = this.pageData[pid];
    if (oldPD) $(oldPD.element).removeClass('selected');
    if (newPD) $(newPD.element).addClass('selected');

    // TODO: scroll to newPID
  }*/

  /*
  showCurrentTexts(tids) {
    const oldTIDs = this.project.currentTexts;
    if (!tids) tids = oldTIDs;

    oldTIDs.forEach((tid) => $(`#p${tid}`).removeClass('selected'))
    oldTIDs.forEach((tid) => $(`#p${tid}t`).removeClass('selected'))
    tids.forEach((tid) => $(`#p${tid}`).addClass('selected'))
    tids.forEach((tid) => $(`#p${tid}t`).addClass('selected'))
    
    // TODO: scroll to newTIDs
  }*/

  // Default update methods

  onMovePage(from, to) {
    LOG('move page');
    this.loadProject(this.project);
  }

  onMoveText(from, to, fromPID, toPID) {
    LOG('move text');
    this.loadProject(this.project);
  }

  onAddPage(pid, to) {
    LOG('add page');
    this.loadProject(this.project);
  }
  
  onRemovePage(from) {
    LOG('remove page');
    this.loadProject(this.project);
  }

  onAddText(text, to, toPID) {
    LOG('add text');
    this.loadProject(this.project);
  }

  onRemoveText(from, fromPID) {
    LOG('remove text');
    this.loadProject(this.project);
  }

  onAddCurrentPage() {}
  onAddCurrentText() {}
  onClearCurrentPage() {}
  onClearCurrentText() {}
}

export { View };

import { namenote } from './namenote.js';
import { T } from './locale.js';
import { Rect } from './rect.js';
import { Text } from './text.js';

class View {
  constructor(element, options = {}) {
    this.element = element;
    this.options = options;
    this.snapshots = {};
  }

  destructor() {
    console.log(`view destructor ${this.id}`);
    if (this.project) {
      this.project.removeView(this);
      this.project = null;
    }

    this.element = null;
    this.options = null;
    this.pageData = {};
  }

  loadProject(project) {
    if (this.project) {
      this.onUnloadProject(this.project);
      this.project.removeView(this);
    }
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

  createFrame(page) {
    const frame = document.createElement('div');
    frame.className = 'frame';
    frame.style.width = page.canvasWidth + 'px';
    frame.style.height = page.canvasHeight + 'px';
    return frame;
  }

  createCanvas(page) {
    const canvas = document.createElement('canvas');
    canvas.width = page.width;
    canvas.height = page.height;
    return canvas;
  }

  createTexts(page) {
    return Text.toElements(page.texts, 'p');
  }

  isDialog() {
    return false;
  }

  detectPID(element) {
    let node = element;
    while (node) {
      if (node.classList.contains('page')) {
        return parseInt(node.id.replace(/^(pageview-|textview-)?page-/, ''), 10);
      }
      node = node.parentNode;
    }
    return null;
  }

  initPageData(page, index) {
    const pid = page.pid;
    if (!this.pageData[pid]) {
      const pageElement = this.createPageElement(pid, index);
      this.content.appendChild(pageElement);
      this.pageData[pid] = {
        element: pageElement
      };
    }
  }

  // Helper methods for pageView/noteView
  updateThumbnail(page, project = page.project) {
    let pd;

    if (this.id === 'page') {
      // project = page.project;
      pd = this.pageData[page.pid];
    } else if (this.projectData) {
      pd = this.projectData[project.url];
    }

    if (!pd) return;

    const rect = project.getThumbnailSize(this.size);
    if (pd.thumbnail) {
      pd.thumbnail.style.width = rect.width + 'px';
      pd.thumbnail.style.height = rect.height + 'px';
      pd.thumbnail.parentNode.style.width = (rect.width + 6) + 'px';

      if (page && page.thumbnail) {
        pd.thumbnail.src = page.thumbnail.toDataURL('image/png');
      }
    }

    pd.element.style.height = (rect.height + 5) + 'px';
    const count = pd.element.querySelector('.count');
    if (count) count.style.left = (rect.width + 18) + 'px';

    if (this.id === 'page') {
      if ((project.currentPage || project.pages[0]) === page) {
        namenote.noteView.updateThumbnail(page, project);
      }
    }
  }

  rotateSize(size) {
    switch (size) {
      case 'small':
        return 'middle';
      case 'middle':
        return 'large';
      case 'large':
      default:
        return 'small';
    }
  }

  handleDiv() {
    const icon = $('<span>').addClass('ui-icon ui-icon-grip-dotted-vertical');
    return $('<div>').addClass('sort-handle').append(icon);
  }

  countDiv(index) {
    return $('<div>').addClass('count').html(index + 1);
  }

  thumbnailDiv(image) {
    return $('<div>').addClass('thumbnail').append(image);
  }

  digestDiv(page) {
    return $('<div>').addClass('digest').html(page.digest());
  }

  noteInfoDiv(project) {
    const info = $('<div>').addClass('info');
    const name = project.name();
    const detail = project.path() + '<br>'
          + project.pages.length + ' ' + T('pages');

    $('<div>').addClass('info-title').html(name).appendTo(info);
    $('<div>').addClass('info-detail').html(detail).appendTo(info);
    return info;
  }

  getPageRect(pid) {
    const pd = this.pageData[pid];
    if (pd && pd.element) {
      return Rect.get(pd.element);
    }
    return null;
  }

  getFocusTextRect() {
  }

  getFocusPageRect() {
  }

  getFocusRect() {
    const page = this.project.currentPage;
    if (page) {
      const pd = this.pageData[page.pid];
      console.log(this.project.currentKeys);
      if (this.project.currentKeys.length > 0) {
        let rect = null;
        this.project.currentKeys.forEach((key) => {
          rect = Rect.merge(this.keyRect(key), rect);
          console.log('...', this.keyRect(key), rect);
        });
        return rect;
      }
      if (pd && pd.element) {
        return Rect.get(pd.element);
      }
    }
    return null;
  }

  isFocusVisible() {
  }

  showFocus() {
  }

  // Default update methods

  onMovePage(from, to) {
    console.log(this.id, 'on movePage', from, to);
    this.loadProject(this.project);
  }

  onMoveText(from, to, fromPID, toPID) {
    console.log(this.id, 'on moveText', from, to, fromPID, toPID);
    this.loadProject(this.project);
  }

  onAddPage(pid, to) {
    console.log(this.id, 'on addPage', pid, to);
    this.loadProject(this.project);
  }

  onRemovePage(from) {
    console.log(this.id, 'on removePage', from);
    this.loadProject(this.project);
  }

  onAddText(text, to, toPID) {
    console.log(this.id, 'on addText', text, to, toPID);
    this.loadProject(this.project);
  }

  onRemoveText(from, fromPID) {
    console.log(this.id, 'on removeText', from, fromPID);
    this.loadProject(this.project);
  }

  onEditText(toText, index, pid) {
    console.log(this.id, 'on editText'); //, toText, index, pid);
    this.loadProject(this.project);
  }

  onEditImage(toImage, rect, pid) {
    console.log(this.id, 'on editImage', toImage, rect, pid);
    this.loadProject(this.project);
  }

  onSetCurrentPage(page) {
    if (page) {
      const pd = this.pageData[page.pid];
      if (pd && pd.element) {
        $(pd.element).addClass('selected');
      }
    }
  }

  onClearCurrentPage() {
    const page = this.project.currentPage;
    if (page) {
      const pd = this.pageData[page.pid];
      if (pd && pd.element) {
        $(pd.element).removeClass('selected');
      }
    }
  }

  onAddCurrentKey(key) {
  }

  onClearCurrentKey() {
  }

  onUnloadProject() {
  }
}

export { View };

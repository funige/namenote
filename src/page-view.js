import { View } from './view.js';
import { ViewFooter } from './view-footer.js';
import { command } from './command.js';
import { pageManager } from './page-manager.js';


class PageView extends View {
  constructor(element, options = {}) {
    super(element, options);
    this.id = 'page';
    this.size = options.thumbnailSize || 'middle';
    
    $(this.element).html(`
      <ul class='content'></ul>
      <ul class='thin-toolbar border-top'></ul>`);
    this.content = this.element.querySelector('.content');
    this.footer = new ViewFooter(this.element.querySelector('.thin-toolbar'), {
      append: () => {
        const to = this.project.currentPageIndex();
        command.addPage(this, to);
      },
      trash: () => {
        const from = this.project.currentPageIndex();
        command.removePage(this, from);
      },
      size: () => {
        this.size = this.rotateSize(this.size);
        this.project.pages.map(page => {
          this.updateThumbnail(page);
        });
      },
    });
    this.enableSmoothScroll(this.content);
    this.init();
  }
  
  init() {
    this.project = null;

    Sortable.create(this.content, {
      animation: 150,
      handle: '.sort-handle',
      onEnd: (e) => {
        command.movePage(this, e.oldIndex, e.newIndex);
      }
    });
  }

  initProject(project) {
    if (!this.element) return;

    this.content.innerHTML = '';
    project.pages.forEach((page, index) => {
      const pid = page.pid;
      const pageElement = this.createPageElement(pid);
      this.content.appendChild(pageElement);

      this.pageData[pid] = {
        element: pageElement
      };
      if (page.loaded()) {
        this.initPage(page);
      }
    });
  }

  initPage(page) {
    const index = this.project.pages.indexOf(page);
    const pd = this.pageData[page.pid];
    if (!pd || !pd.element) return;

    const rect = this.project.getThumbnailSize();
    pd.thumbnail = new Image(rect.width, rect.height);

    const li = $(pd.element);
    this.handleDiv().appendTo(li);
    this.thumbnailDiv(pd.thumbnail).appendTo(li);
    this.digestDiv(page).appendTo(li);
    this.countDiv(index).appendTo(li);

    this.updateThumbnail(page);
  }

  createPageElement(pid) {
    const element = document.createElement('li');
    element.className = 'page';
    element.id = 'pageview-page-' + pid;
    return element;
  }

  loadProject(project) {
    super.loadProject(project);

    // Init project
    this.pageData = {};
    this.initProject(project);
    const url = project.url.replace(/[^/]+\/[^/]+$/, '');

    if (this.options.loaded) this.options.loaded(url, project.url);

    this.onLoadProject(project);
  }

  showProgress(message) {
    console.log('pageView: show progress', message);
  }

  showSpinner() {
    console.log('[show spinner]');
  }

  hideSpinner() {
    console.log('[hide spinner]');
  }

  initCurrentPage() {
    const page = this.project.currentPage;
    this.onSetCurrentPage(page);
  }

  onLoadProject(project) {
    const snapshot = this.snapshots[project.url] || {};
    this.content.scrollTop = snapshot.scrollTop || 0;

    this.initCurrentPage();
  }

  onUnloadProject(project) {
    this.snapshots[project.url] = {
      scrollTop: this.content.scrollTop,
    };      
  }

  onEditImage(toImage, rect, pid) {
    const page = pageManager.find(this.project, pid);
    this.updateThumbnail(page);
  }

}


export { PageView };

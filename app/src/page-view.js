import { View } from './view.js';
import { ViewFooter } from './view-footer.js';
import { command } from './command.js';


class PageView extends View {
  constructor(element, options) {
    super(element, options);
    this.id = 'page';

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
      size: () => { LOG('page size'); },
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
      this.updatePage(pid, index);
    });
  }

  initPage(page) {
    const index = this.project.pages.indexOf(page);
    const pd = this.pageData[page.pid];
    if (!pd || !pd.element) {
      ERROR('abort init page', page.pid);
      return;
    }

    const rect = this.project.getThumbnailSize();
    pd.thumbnail = new Image(rect.width, rect.height);
    pd.thumbnail.src = page.thumbnail.toDataURL('image/png');

    const thumbnail = $('<div class=\'thumbnail\'></div>');
    thumbnail.width(rect.width + 10); // [0].style.width = '40px'
    thumbnail.append(pd.thumbnail);

    const digest = $(`<div class='digest'>${page.digest()}</div>`);
    const handle = $(`
      <div class="sort-handle">
        <span class="ui-icon ui-icon-grip-dotted-vertical"></span>
      </div>`);
    const count = $(`
      <div class="count">
        ${index + 1}
      </div>`);

    $(pd.element).append(handle);
    $(pd.element).append(thumbnail);
    $(pd.element).append(digest);
    $(pd.element).append(count);
  }

  createPageElement(pid) {
    const element = document.createElement('li');
    const rect = this.project.getThumbnailSize();
    element.style.height = (rect.height + 10) + 'px';

    element.className = 'page';
    element.id = 'pageview-page-' + pid;
    return element;
  }

  updatePage(pid, index, updateThumbnail) {
    const page = this.project.pages[index];
    if (page && updateThumbnail) {
      const pd = this.pageData[page.pid];
      pd.thumbnail.src = page.thumbnail.toDataURL('image/png');

      const rect = this.project.getThumbnailSize();
      pd.thumbnail.style.width = 30; // rect.width
      pd.thumbnail.style.height = rect.height;
      pd.element.style.height = (rect.height + 10) + 'px';
    }
  }

  loadProject(project) {
    super.loadProject(project);
    
    // Init project
    this.pageData = {};
    this.initProject(project);

    const url = project.url.replace(/[^/]+\/[^/]+$/, '');

    WARN(this.options);
    if (this.options.loaded) this.options.loaded(url, project.url);

    // Restore previous state
    this.initCurrentPage();
  }

  showProgress(message) {
    WARN('pageView: show progress', message);
  }

  showSpinner() {
    WARN('[show spinner]');
  }

  hideSpinner() {
    WARN('[hide spinner]');
  }

  initCurrentPage() {
    const pid = this.project.currentPage;
    this.onSetCurrentPage(pid)
  }

  onSetCurrentPage(pid) {
    const pd = this.pageData[pid];
    if (pd && pd.element) {
      $(pd.element).addClass('selected');
    }
  }

  onClearCurrentPage() {
    const pid = this.project.currentPage;
    const pd = this.pageData[pid];
    if (pd && pd.element) {
      $(pd.element).removeClass('selected');
    }
  }
}


export { PageView };

import { View } from './view.js';
import { ViewFooter } from './view-footer.js';
import { command } from './command.js';
import { Text } from './text.js';
import { Rect } from './rect.js';
import { pageManager } from './page-manager.js';


class TextView extends View {
  constructor(element) {
    super(element);
    this.id = 'text';

    $(this.element).html(`
      <ul class='content'></ul>
      <ul class='thin-toolbar border-top'></ul>`);
    this.content = this.element.querySelector('.content');
    this.footer = new ViewFooter(this.element.querySelector('.thin-toolbar'), {
      append: () => {
        const toPID = this.project.currentPage.pid;
        const to = this.project.currentTextIndex();
        command.addText(this.project, to, toPID);
      },
      trash: () => {
        const fromPID = this.project.currentPage.pid;
        const from = this.project.currentTextIndex();
        command.removeText(this.project, from, fromPID);
      }
    });

    this.enableSmoothScroll(this.content);
    this.init();
  }

  init() {
    this.project = null;
  }

  initProject(project) {
    if (!this.element) return;

    this.content.innerHTML = '';
    project.pages.forEach((page, index) => {
      this.initPageData(page, index);


      if (page.loaded) {
        this.initPage(page);
      }
    });
  }

  initPage(page) {
    const pd = this.pageData[page.pid];
    if (!pd || !pd.element) return;

    const ul = pd.element.getElementsByTagName('ul')[0];
    page.texts.forEach((text) => {
      const p = $('<div>').addClass('dock-text').html(text.innerHTML);
      const handle = this.handleDiv();
      p.attr('id', 't' + text.key);
      p.attr('contentEditable', true);

      const li = $('<li>').append(handle).append(p).appendTo(ul);
      p.on('focus', (e) => {
        this.onFocus(e);
      });
      p.on('blur', (e) => {
        this.onBlur(e);
      });
      p.on('input', (e) => {
        this.onInput(e);
      });
    });

    Sortable.create(ul, {
      animation: 150,
      handle: '.sort-handle',
      group: 'text-view',
      onEnd: (e) => {
        const oldPID = this.detectPID(e.from.parentNode);
        const newPID = this.detectPID(e.to.parentNode);
        command.moveText(this.project, e.oldIndex, e.newIndex, oldPID, newPID);
      }
    });
  }

  createPageElement(pid, index) {
    const element = $(`<li>
          <div class="count">${index + 1}</div>
          <ul class="dock-texts"></ul>
        </li>`)[0];

    element.className = 'page'; // 'textview-page';
    element.id = 'textview-page-' + pid;
    return element;
  }

  async loadProject(project) {
    super.loadProject(project);
    
    // Init project
    this.pageData = {};
    if (!project) {
      this.content.innerHTML = '';
      return;
    }

    this.initProject(project);
    this.onLoadProject(project);
  }

  keyElement(key) {
    return document.getElementById('t' + key);
  }
  
  keyRect(key) {
    return Rect.get(this.keyElement(key));
  }

  initCurrentPage() {
    const page = this.project.currentPage;
    this.onSetCurrentPage(page);
  }

  initCurrentKeys() {
    this.project.currentKeys.forEach((key) => {
      this.onAddCurrentKey(key);
    });
  }

  onAddCurrentKey(key) {
    const tmp = $('#t' + key);
    tmp.addClass('selected');
    tmp.prev().addClass('selected');
  }

  onClearCurrentKey() {
    this.project.currentKeys.forEach((key) => {
      const tmp = $('#t' + key);
      tmp.removeClass('selected');
      tmp.prev().removeClass('selected');
    });
  }

  onFocus(e) {
    const key = parseInt(e.target.id.replace(/^t/, ''));
    this.project.clearCurrentKey();
    this.project.addCurrentKey(key);
  }

  onBlur(e) {
    Text.clearSelection();

    /*
    const key = parseInt(e.target.id.replace(/^t/, ''));
    const element = document.getElementById('p' + key);
    if (element) {
      const pid = this.detectPID(element);
      const page = pageManager.find(this.project, pid);
      const index = this.project.findTextIndex(page, key);

      const toText = page.toText(element, 'p');
      const fromText = page.texts[index];
      console.warn(page.texts, fromText, toText);

      if (!this.shallowEqual(fromText, toText)) {
        console.log('text edited!', fromText, toText);
        command.editText(this.project, toText, index, pid);
      }
    }
    */
  }

  onInput(e) {
    const key = parseInt(e.target.id.replace(/^t/, ''));
    const element = document.getElementById('p' + key);
    if (element) {
      element.innerHTML = e.target.innerHTML;
    }
  }
  
  onLoadProject(project) {
    const snapshot = this.snapshots[project.url] || {};
    this.content.scrollTop = snapshot.scrollTop || 0;

    this.initCurrentPage();
    this.initCurrentKeys();
  }

  onUnloadProject(project) {
    this.snapshots[project.url] = {
      scrollTop: this.content.scrollTop
    };
  }

//onEditText() {} // これはundoの時動かない。repaintも動いてない？
  onEditImage() {}
}

export { TextView };

import { View } from './view.js';
import { ViewFooter } from './view-footer.js';
import { command } from './command.js';
import { controller } from './controller.js';


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
        LOG('add text');
        command.addText();
      },
      trash: () => {
        LOG('remove text');
        command.removeText();
      },
      size: () => { LOG('text size'); },
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
      const pid = page.pid;
      const pageElement = this.createPageElement(pid, index);
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
    const pd = this.pageData[page.pid];
    if (!pd || !pd.element) {
      ERROR('textView: abort init page');
    }

//  const texts = this.createTexts(page, page.texts.innerHTML);
    page.texts.childNodes.forEach((p) => {
      const text = $('<div class="dock-text"></div>')[0];
      const handle = $(`
        <div class="sort-handle">
          <span class="ui-icon ui-icon-grip-dotted-vertical"></span>
        </div>`)[0];

      text.id = p.id.replace(/^p/, 't');
      text.innerHTML = p.innerHTML;
      text.style.whiteSpace = 'nowrap';
      text.contentEditable = true;
      text.addEventListener('input', (e) => {
        const id = e.target.id.replace(/^t/, 'p');
        const element = document.getElementById(id);
        if (element) {
          element.innerHTML = e.target.innerHTML;
        }
      });
      text.addEventListener('focus', (e) => {
        this.onFocus(e);
      });
      text.addEventListener('blur', (e) => {
        this.onBlur(e);
      });

      const li = $('<li></li>');
      li.append($(handle));
      li.append($(text));
      $(pd.element.getElementsByTagName('ul')[0]).append(li);
    });

    Sortable.create(pd.element.getElementsByTagName('ul')[0], {
      animation: 150,
      handle: '.sort-handle',
      group: 'text-view',
      onEnd: (e) => {
        const oldPID = controller.detectPID(e.from.parentNode);
        const newPID = controller.detectPID(e.to.parentNode);
        command.moveText(this, e.oldIndex, e.newIndex, oldPID, newPID);
      }
    });
  }

  createPageElement(pid, index) {
    const element = $(`<li>
          <div class="count">${index + 1}</div>
          <ul class="dock-texts"></ul>
        </li>`)[0];

    element.className = 'textview-page';
    element.id = 'textview-page-' + pid;
    return element;
  }

  updatePage(pid, index) {
    // TODO
  }

  async loadProject(project) {
    super.loadProject(project);
    
    // Init project
    this.pageData = {};
    this.initProject(project);

    // Restore previous state
    this.initCurrentPage();
  }

  initCurrentPage() {
    this.project.currentPages.forEach((pid) => {
      this.onAddCurrentPage(pid)
    })
  }

  onAddCurrentPage(pid) {
    const pd = this.pageData[pid];
    if (pd && pd.element) {
      $(pd.element).addClass('selected');
    }
  }

  onClearCurrentPage() {
    this.project.currentPages.forEach((pid) => {
      const pd = this.pageData[pid];
      if (pd && pd.element) {
        $(pd.element).removeClass('selected');
      }
    })
  }


  onAddCurrentText(tid) {
    $('#t' + tid).addClass('selected');
  }

  onClearCurrentText() {
    this.project.currentTexts.forEach((tid) => {
      $('#t' + tid).removeClass('selected');
    })
  }
  
  onFocus(e) {
    const tid = e.target.id.replace(/^t/, '');
    this.project.clearCurrentText();
    this.project.addCurrentText(tid);
  }
  
  onBlur(e) {
    //this.project.clearCurrentText();
  }
  
}

export { TextView };

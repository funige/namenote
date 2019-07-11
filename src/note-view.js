import { View } from './view.js';
import { ViewFooter } from './view-footer.js';
import { projectManager } from './project-manager.js';


class NoteView extends View {
  constructor(element) {
    super(element);
    this.id = 'note';

    $(this.element).html(`
      <div class='content'></div>
      <ul class='thin-toolbar border-top'></ul>`);
    this.content = $(this.element).find('.content')[0];
    this.footer = new ViewFooter($(this.element).find('.thin-toolbar')[0]);

    this.init();
  }

  init() {
    Sortable.create(this.content, {
      animation: 150,
      handle: '.sort-handle',
      onEnd: (e) => {
        console.log('noteView onEnd:', e);
        console.log(e.oldIndex, '->', e.newIndex);
      }
    });
  }

  update() {
    this.content.innerHTML = '';
    projectManager.projects.forEach((project) => {
      const projectElement = this.createProjectElement(project);
      this.content.appendChild(projectElement);
    });
  }

  createProjectElement(project) {
    const li = document.createElement('li');
    li.innerHTML = `[${project.url}]`;
    li.addEventListener('click', (e) => {
      console.log('select', project.url);
    });
    return li;
  }
}

export { NoteView };

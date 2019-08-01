import { namenote } from './namenote.js';
import { View } from './view.js';
import { ViewFooter } from './view-footer.js';
import { projectManager } from './project-manager.js';


class NoteView extends View {
  constructor(element, options = {}) {
    super(element, options);
    this.id = 'note';
    this.size = options.thumbnailSize || 'small';

    $(this.element).html(`
      <div class='content'></div>
      <ul class='thin-toolbar border-top'></ul>`);
    this.content = $(this.element).find('.content')[0];
    this.footer = new ViewFooter(this.element.querySelector('.thin-toolbar'), {
      append: () => {
        console.log('noteView append');
      },
      trash: () => {
        console.log('noteView trash');
      }
      /* size: () => {
        this.size = this.rotateSize(this.size);
        projectManager.projects.map(project => {
          this.updateThumbnail(project.currentPage || project.pages[0]);
        })
      }, */
    });

    this.enableSmoothScroll(this.content);
    this.init();
  }

  init() {
    Sortable.create(this.content, {
      animation: 150,
      disable: true,
      handle: '.sort-handle',
      onEnd: (e) => {
        console.log('noteView onEnd:', e);
        console.log(e.oldIndex, '->', e.newIndex);
      }
    });
  }

  loadProjects() {
    this.projectData = {};

    this.content.innerHTML = '';
    projectManager.projects.forEach((project) => {
      const url = project.url;
      const projectElement = this.createProjectElement(url);
      this.content.appendChild(projectElement);

      this.projectData[url] = {
        element: projectElement
      };

      this.initProject(project);
    });
  }

  initProject(project) {
    const pd = this.projectData[project.url];

    const rect = project.getThumbnailSize();
    pd.thumbnail = new Image(rect.width, rect.height);

    const li = $(pd.element);
    this.handleDiv().appendTo(li);
    this.thumbnailDiv(pd.thumbnail).appendTo(li);
    this.noteInfoDiv(project).appendTo(li);
    this.updateThumbnail(project.currentPage || project.pages[0]);
  }

  createProjectElement(url) {
    const element = document.createElement('li');
    element.className = 'project';
    element.alt = url;

    const currentProject = namenote.currentProject();
    if (currentProject && currentProject.url === url) {
      element.classList.add('selected');
    }
    return element;
  }

  /* onShow() {
    this.loadProjects();
  } */

  /* addProject(project) {
    this.loadProjects();
  } */
}

export { NoteView };

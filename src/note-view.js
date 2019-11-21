import { namenote } from './namenote.js';
import { View } from './view.js';
import { ViewFooter } from './view-footer.js';
import { projectManager } from './project-manager.js';
import { command } from './command.js';


class NoteView extends View {
  constructor(element, options = {}) {
    super(element, options);
    this.id = 'note';
    this.size = options.thumbnailSize || 'small';

    $(this.element).html(`
      <ul class='content'></ul>
      <ul class='thin-toolbar border-top'></ul>`);
    this.content = (this.element).querySelector('.content');
    this.footer = new ViewFooter(this.element.querySelector('.thin-toolbar'), {
      append: () => {
        const to = this.currentNoteIndex();
        if (1) { //to >= 0) {
          command.addNote(to);
        }
      },
      trash: () => {
        const from = this.currentNoteIndex();
        if (from >= 0) {
          command.removeNote(from);
        }
      },
      /*
      lock: () => {
        console.log('noteView lock');
      }
      */
    });

    this.enableSmoothScroll(this.content);
    this.init();
  }

  init() {
    Sortable.create(this.content, {
      animation: 150,
      handle: '.sort-handle',
      group: "note-view",
      onEnd: (e) => {
        console.log('noteView onEnd:', e);
        command.moveNote(e.oldIndex, e.newIndex);
      }
    });
  }

  loadProjects() {
    console.warn('noteView: loadProjects');
    this.projectData = {};
    this.content.innerHTML = '';
    
    projectManager.projects.forEach((project) => {
      const url = project.url;
      const projectElement = this.createProjectElement(url);
      this.content.appendChild(projectElement);

      this.projectData[url] = {
        element: projectElement
      };

      this.initProjectElement(project);
    });
  }

  initProjectElement(project) {
    const pd = this.projectData[project.url];

    const rect = project.getThumbnailSize();
    pd.thumbnail = new Image(rect.width, rect.height);

    const li = $(pd.element);
    this.handleDiv().appendTo(li);
    this.thumbnailDiv(pd.thumbnail).appendTo(li);
    this.noteInfoDiv(project).appendTo(li);
    this.updateThumbnail((project.currentPage || project.pages[0]), project);

    li.on('click', (e) => {
      namenote.loadProject(project);
    });
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

  currentNoteIndex() {
    const currentProject = namenote.currentProject();
    return projectManager.projects.findIndex(project => project === currentProject);
  }
      
  /* onShow() {
    this.loadProjects();
  } */

  /* addProject(project) {
    this.loadProjects();
  } */
}

export { NoteView };

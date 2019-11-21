import { Project } from './project.js';
import { pageManager } from './page-manager.js';
import { file } from './file.js';
import { projectTemplate } from './project-template.js';
import { autosave } from './autosave.js';


class ProjectManager {
  constructor() {
    this.projects = [];
  }

  async create(params) {
    const baseURL = `${params.path}${params.name}`;
    const url = `${baseURL}/${params.name}.namenote`;
    console.warn('project manager create', baseURL, url);

    file.mkdir(baseURL);
    const template = { params: projectTemplate.Manga, pids: [] };
    const project = new Project(url, template);

    for (let i = 0; i < params.page_count; i++) {
      const page = await pageManager.create(project); // eslint-disable-line no-await-in-loop
      project.pages.push(page);
    }
    console.warn('create project=>', project);

    this.addProject(project);
    autosave.push(project);
    return project;


    /*
    const project = new Project()
    for (const i = 0; i < params.page_count; i++) {
      pids.push(i + 1);
    }
    const project = new Project(url, )
    return null;
    */
  }

  async get(url) {
    let project = this.find(url);
    if (!project) {
      const json = await file.readJSON(url);
      project = new Project(url, json);
      project.pages = project.pids.map((pid) => pageManager.get(project, pid));
      this.addProject(project);
    }
    return project;
  }

  find(url) {
    return this.projects.find(project => project.url === url);
  }

  addProject(project) {
    this.projects.push(project);
  }

  canRemoveProject(project) {
    // TODO: pageとprojectが削除できるかどうか先に確認する
    return true;
  }
  
  removeProject(project) {
    if (!this.canRemoveProject(project)) return;
    
    const index = this.projects.findIndex(item => item === project);
    console.log(index);
    
    if (index >= 0) {
      this.projects[index].destructor();
      this.projects.splice(index, 1);
      
      if (this.projects.length > 0) {
        namenote.loadProject(this.projects[(index > 0) ? index - 1 : 0]);
      } else {
        namenote.loadProject(null);
      }
    }
    pageManager.removePagesForURL(project.url);
  }
}

const projectManager = new ProjectManager();

export { projectManager };

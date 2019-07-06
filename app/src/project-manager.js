import { namenote } from './namenote.js';
import { Project } from './project.js';
import { pageManager } from './page-manager.js';
import { file } from './file.js';
import { dialog } from './dialog.js';


class ProjectManager {
  constructor() {
    this.projects = [];
  }

  async get(url) {
    let project = this.find(url);
    if (!project) {
      const json = await file.readJSON(url);
      project = new Project(url, json);
      project.pages = project.pids.map((pid) => pageManager.get(project, pid))
      this.addProject(project);
    }
    return project;
  }

  find(url) {
    return this.projects.find(project => project.url === url)
  }

  addProject(project) {
    this.projects.push(project);
    namenote.noteView.update(project);
  }
}

const projectManager = new ProjectManager();

export { projectManager };

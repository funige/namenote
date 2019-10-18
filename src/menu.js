import { namenote } from './namenote.js';
import { menuTemplate } from './menu-template.js';
import { recentURL } from './recent-url.js';
import { config } from './config.js';

let template;
let states = {};
let checks = {};

const findSubmenu = (template, label) => {
  for (const item of template) {
    if (item.label === label) {
      return item;
    }
    if (item.submenu) {
      const result = findSubmenu(item.submenu, label);
      if (result) return result;
    }
  }
  return null;
};

const setEnabled = (template, label, value) => {
  const item = findSubmenu(template, label);
  if (item) {
    value = !!(value);

    item.enabled = value;
    if (item.submenu) {
      if (!value) delete (item.submenu);
    }
    states[label] = value;
  }
};

const setChecked = (template, label, value) => {
  const item = findSubmenu(template, label);
  if (item) {
    value = !!(value);

    item.checked = value;
    checks[label] = value;

    /* Native menu got broken...
    if (value) {
      item.type = 'checkbox';
      item.checked = true;
    }
    */
  }
};

//

class Menu {
  init() {
    this.update();
  }

  update() {
    template = JSON.parse(JSON.stringify(menuTemplate));
    states = {};
    checks = {};

//  this.updateRecents(template);
    this.updateStates(template);
    this.updateChecks(template);
    this.rebuild(template);
  }

  rebuild(template) {
    if (namenote.app) {
      namenote.app.rebuildMenu(template);
    }
  }

  updateRecents(template) {
    const recents = findSubmenu(template, 'Open Recent').submenu;
    for (const item of recentURL.data) {
      recents.push({
        label: item, data: item, click: 'openURL'
      });
    }
  }

  updateStates(template) {
    const isApp = !!(namenote.app);
    setEnabled(template, 'Full Screen', isApp || window.chrome);
    setEnabled(template, 'Developer Tools', isApp);
    //  setEnabledd(template, 'Open ...', isApp)

    const project = namenote.currentProject();
    const isProject = !!(project);
    //  setEnabled(template, 'Close', isProject)
    //  setEnabled(template, 'Close All', isProject)
    setEnabled(template, 'Save Snapshot As ...', isProject);
    setEnabled(template, '.txt (Plain Text) ...', isProject);
    setEnabled(template, '.csnf (CLIP STUDIO Storyboard) ...', isProject);
    setEnabled(template, '.pdf (PDF) ...', isProject);

    setEnabled(template, 'Add', isProject);
    setEnabled(template, 'Move to Buffer', isProject);
    setEnabled(template, 'Put Back from Buffer', isProject);
    setEnabled(template, 'Empty Buffer', isProject);
    setEnabled(template, 'Move Forward', isProject);
    setEnabled(template, 'Move Backward', isProject);
    setEnabled(template, 'Extract Text', isProject);
    setEnabled(template, 'Save Image As ...', isProject);

    setEnabled(template, 'Undo', isProject); // && project.history.hasUndo())
    setEnabled(template, 'Redo', isProject); // && project.history.hasRedo())
  }

  updateChecks(template) {
    setChecked(template, 'Dock', config.getValue('sideBar'));
    setChecked(template, 'Print Preview', config.getValue('printPreview'));
    setChecked(template, 'Multipage', config.getValue('multipage'));
  }

  getEnabled(label) {
    return states[label];
  }

  getChecked(label) {
    return checks[label];
  }
}

const menu = new Menu();

export { menu };

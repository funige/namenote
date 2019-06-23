import { namenote } from './namenote.js';
import { locale } from './locale.js';
import { dialog } from './dialog.js';
import { file } from './file.js';
import { recentURL } from './recent-url.js';
import { projectManager } from './project-manager.js';

const MAX_FILES_IN_FOLDER = 1000;

// //////////////////////////////////////////////////////////////

class Finder {
  constructor(folders, fileList, toggleButton, options) {
    this.folders = folders;
    this.fileList = fileList;
    this.toggleButton = toggleButton;
    this.options = options || {};

    this.init();
  }

  destructor() {
  }

  init() {
    $(this.fileList).selectable({
      filter: 'li:not(.disabled)',
      autoRefresh: false,
      delay: 0,
      selecting: (event, ui) => {
        WARN('finder selecting...');

        $(event.target).find('.ui-selectee.ui-selecting').not(ui.selecting)
          .removeClass('ui-selecting');
        $(event.target).find('.ui-selectee.ui-selected').not(ui.selecting)
          .removeClass('ui-selected');
      },
      selected: (event, ui) => {
        WARN('finder selected...', this.options);

        const newurl = `${this.url}${ui.selected.getAttribute('value')}/`;
        if (this.options.selected) this.options.selected(newurl);
      }
    });


    $(this.folders).iconselectmenu({
      change: (event, ui) => {
        WARN('finder change...');

        if (ui.item && ui.item.value) {
          const newurl = ui.item.value;
          if (this.options.selected) this.options.selected(newurl);
        }
      }
    });

    if (this.toggleButton) {
      $(this.toggleButton).toggleButton({
        autoOpen: this.options.autoOpen,
        height: this.options.height,

        click: (e) => {
          const open = !$(this.toggleButton).toggleButton('open');
          $(this.toggleButton).toggleButton('open', open);
          this.toggle(open);
        }
      });
      this.toggle(this.options.autoOpen);
    }
  }

  toggle(open) {
    if (open) {
      this.fileList.style.height = this.options.height;
    } else {
      this.options.height = this.fileList.style.height;
      this.fileList.style.height = '0';
    }
  }

  async loadFolder(url) {
    WARN('loadFolder', url);
    const tmp = [];
    const dirents = await file.readdir(url).catch((e) => {
      return dialog.alert(e);
    });
    if (dirents.length > MAX_FILES_IN_FOLDER) {
      return alert(T('Too many files in this folder.'));
    }

    for (const dirent of dirents) {
      if (dirent.name.match(/^\./)) continue;
      const icon = dirent.isDirectory() ? 'ui-icon-folder-collapsed' : 'ui-icon-blank';
      const disabled = dirent.isDirectory() ? '' : 'disabled';
      tmp.push(`
        <li class='${disabled}' value='${dirent.name}'>
          <span class='ui-icon ${icon}'></span>
          ${dirent.name}
        </li>`);
    }
    $(this.fileList).html(tmp.join(''));
    $(this.fileList).selectable('refresh');
    this.updateFolders(url);
  }

  updateFolders(url, projectURL) {
    this.url = url;

    const tmp = [];

    if (projectURL) {
      const label = file.getLabel(projectURL);
      tmp.push(`<option data-class='${label.icon}' value='${projectURL}'>${label.text}</option>`);
    }

    const ancestors = this.getAncestors(url);
    for (const item of ancestors) {
      const label = file.getLabel(item);
      tmp.push(`<option value='${item}'>${label.path}</option>`);
    }

    if (!this.options.noRecents) {
      const str = T('Recent Notes');
      tmp.push(`<option disabled style="border-top:1px solid red;">${str}</option>`);

      for (const item of recentURL.data) {
        const label = file.getLabel(item);
        tmp.push(`<option data-class='${label.icon}' value='${item}'>${label.text}</option>`);
      }
    }

    $(this.folders).html(tmp.join(''));
    $(this.folders).iconselectmenu('refresh');
  }

  getAncestors(url) {
    url = `${file.getScheme(url)}:${file.getPath(url)}`;
    const arr = url.split('/');
    const result = [];
    arr[0] += '//';
    arr.pop();

    let ext = (url.match(/\.namenote$/i)) ? '' : '/';
    do {
      result.push(arr.join('/') + ext);
      ext = '/';
      arr.pop();
    } while (arr.length > 0);

    WARN('get ancestors', result);
    return result;
  }
}

export { Finder };

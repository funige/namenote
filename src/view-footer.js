import { Widget } from './widget.js';

// //////////////////////////////////////////////////////////////

class ViewFooter {
  constructor(element, options) {
    this.element = element;
    this.options = options || {};
    this.init();
  }


  init() {
    this.element.innerHTML = '';

    const appendButton = Widget.createImageButton({
      src: 'img/zoom-button.png',
      click: () => {
        this.options.append();
      },
      float: 'left',
      title: 'Add'
    });

    const trashButton = Widget.createImageButton({
      src: 'img/trash-button.png',
      click: () => {
        this.options.trash();
      },
      float: 'left',
      title: 'Remove'
    });

    const cloneButton = Widget.createImageButton({
      src: 'img/clone-button.png',
      click: () => {
        this.options.size();
      },
      float: 'left',
      title: 'Duplicate'
    });

    const sizeButton = Widget.createImageButton({
      src: 'img/magnifier-button.png',
      click: () => {
        this.options.size();
      },
      float: 'right',
      title: 'Scale'
    });

    const lockButton = Widget.createImageButton({
      src: 'img/lock-button.png',
      click: () => {
        this.options.size();
      },
      float: 'right',
      title: 'Write Protect'
    });

    if (this.options.append) this.element.appendChild(appendButton);
    if (this.options.clone) this.element.appendChild(cloneButton);
    if (this.options.trash) this.element.appendChild(trashButton);
    if (this.options.size) this.element.appendChild(sizeButton);
    if (this.options.lock) this.element.appendChild(lockButton);
  }
}

export { ViewFooter };

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
        if (this.options.append) this.options.append();
      },
      float: 'left'
    });

    const trashButton = Widget.createImageButton({
      src: 'img/redo-button.png',
      click: () => {
        if (this.options.trash) this.options.trash();
      },
      float: 'left'
    });

    const sizeButton = Widget.createImageButton({
      src: 'img/flip-button.png',
      click: () => {
        if (this.options.size) this.options.size();
      },
      float: 'right'
    });

    this.element.appendChild(appendButton);
    this.element.appendChild(trashButton);
    this.element.appendChild(sizeButton);
  }
}

export { ViewFooter };

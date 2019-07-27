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
      float: 'left'
    });

    const trashButton = Widget.createImageButton({
      src: 'img/redo-button.png',
      click: () => {
        this.options.trash();
      },
      float: 'left'
    });

    const sizeButton = Widget.createImageButton({
      src: 'img/flip-button.png',
      click: () => {
        this.options.size();
      },
      float: 'right'
    });

    if (this.options.append) this.element.appendChild(appendButton);
    if (this.options.trash) this.element.appendChild(trashButton);
    if (this.options.size) this.element.appendChild(sizeButton);
  }
}

export { ViewFooter };

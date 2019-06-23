import { Widget } from './widget.js';

// //////////////////////////////////////////////////////////////

class ViewFooter {
  constructor(element) {
    this.element = element;
    this.init();
  }


  init() {
    this.element.innerHTML = '';

    const trashButton = Widget.createImageButton({
      src: 'img/zoom-button.png',
      click: () => {
        LOG('trash');
      },
      float: 'left'
    });

    const appendButton = Widget.createImageButton({
      src: 'img/redo-button.png',
      click: () => {
        LOG('append');
      },
      float: 'left'
    });

    // test
    const sizeButton = Widget.createImageButton({
      src: 'img/flip-button.png',
      click: () => {
        LOG('size');
      },
      float: 'right'
    });

    this.element.appendChild(trashButton);
    this.element.appendChild(appendButton);
    this.element.appendChild(sizeButton);
  }
}

export { ViewFooter };

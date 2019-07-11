// //////////////////////////////////////////////////////////////

class HTMLDropdown {
  constructor() {
  }

  init() {
  }

  open(element) {
    log('open', element);
    element.style.display = 'block';
  }

  close(element) {
    log('close');
    element.style.display = 'none';
  }

  make(template, id) {
    const content = document.createElement('div');
    content.className = 'dropdown-content';
    content.id = id + '-dropdown';

    content.innerHTML = `[${id}]`;
    return content;
  }
}

const htmlDropdown = new HTMLDropdown();

export { htmlDropdown };

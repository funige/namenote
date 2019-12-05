import { namenote } from './namenote.js';

/**
 * To create text element, 5 basic params are required:
 * - fontFamily
 * - fontSize
 * - writingMode
 * - left
 * - top
 */

class Text {
  static getHTML(element) {
    const p = $(element.outerHTML)[0];
    Text.cleanup(p);
    return p.outerHTML;
  }

  static cleanup(p) {
    p.classList.remove('editable', 'selected');
    p.style.color = '';
    p.innerHTML = Text.flatten(p.innerHTML);
    return p;
  }

  static flatten(text) {
    let result = text
      .replace(/(\r|\n)/g, '')
      .replace(/(<([^>]+)>)/g, '\n')
      .replace(/\n+/g, '\n')
      .replace(/^\n/, '')
      .replace(/\n$/, '')

      .replace(/\n/g, '<br>');
    //result = result.replace(/\n/, '<div>&#8203;');
    //result = result.replace(/\n/g, '</div><div>&#8203;');
    //if (result.indexOf('div') > 0) result = result + '</div>'
    //console.warn(result);

    return result;
  }

  static toPlainText(html) { // for CSNF export
    let result = html
      .replace(/^<div[^>]*>/, '')
      .replace(/(<br>)?<\/div><div[^>]*>/g, '\n')
      .replace(/<br>/g, '\n')
      .replace(/<div[^>]*>/g, '\n')
      .replace(/<\/div>/g, '');

    result = result
      .replace(/&nbsp;/g, ' ')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&amp;/g, '&');

    console.log(html, '=>', result);
    return result;
  }

  static measure(element) {
    return new Promise((resolve) => {
      const tmp = element.cloneNode(true);
      tmp.id = '';
      tmp.style.visibility = 'hidden';
      $('body')[0].appendChild(tmp);

      setTimeout(() => {
        const rect = { width: tmp.offsetWidth, height: tmp.offsetHeight };
        tmp.parentNode.removeChild(tmp);
        resolve(rect);
      }, 0);
    });
  }

  static clearSelection() {
    const sel = window.getSelection ? window.getSelection() : document.selection;
    if (sel) {
      if (sel.removeAllRanges) {
        sel.removeAllRanges();
      } else if (sel.empty) {
        sel.empty();
      }
    }
  }
  
  static initPosition(element) {
    const width = element.offsetWidth;
    const height = element.offsetHeight;
    element.alt = JSON.stringify({ width: width, height: height });
  }
  
  static fixPosition(element) {
    console.warn('[fixPosition]', element.id, element.alt);
    const width = element.offsetWidth;
    const height = element.offsetHeight;

    if (Text.isVert(element)) {
      const data = JSON.parse(element.alt);
      if (width !== data.width) {
        const left = parseFloat(element.style.left) - (width - data.width);
        element.style.left = left + 'px';
      }
    }
    element.alt = JSON.stringify({ width: width, height: height });
  }

  static toggleDirection(element) {
    if (Text.isVert(element)) {
      element.style.left = parseFloat(element.style.left) + element.offsetWidth + 'px';
      element.style.writingMode = 'horizontal-tb';
      element.alt = '';
    } else {
      element.style.writingMode = 'vertical-rl';
      element.style.left = parseFloat(element.style.left) - element.offsetWidth + 'px';
      element.alt = '';
    }
    setImmediate(() => { Text.initPosition(element); });
  }

  static isVert(element) {
    return (element.style.writingMode === 'vertical-rl');
  }

  static increaseFontSize(element) {
    const size = parseFloat(element.style.fontSize);
    const newSize = (size >= 72) ? size : size + 1;
    element.style.fontSize = newSize + 'px';
  }

  static decreaseFontSize(element) {
    const size = parseFloat(element.style.fontSize);
    const newSize = (size <= 8) ? size : size - 1;
    element.style.fontSize = newSize + 'px';
  }

  static createNext(source, callback) {
    const text = (source) ? {...source} : this.createFromTemplate();
    text.key = namenote.getUniqueID();
    text.innerHTML = '';

    if (source) {
      if (source.vert) {
        console.log('createnext left', text.size);
        const width = (text.size * 1.5);
        text.x -= width;

      } else {
        const element = document.getElementById('p' + source.key);
        const height = element.offsetHeight + (text.size * 0.5);
        console.log('createnext bottom', height);
        text.y += height;
      }
    }

    setTimeout(() => {
      if (callback) {
        callback(text);
      }
    }, 0);

    return text;
  }

  static createFromTemplate({
    x = 100, //0,
    y = 100, //0,
    font = 'sans-serif',
    size = 14,
    vert = true
  } = {}) {
    /*
    const p = document.createElement('div');
    p.className = 'text';
    p.contentEditable = false;

    p.style.position = 'absolute';
    p.style.left = x + 'px';
    p.style.top = y + 'px';
    p.style.fontFamily = font;
    p.style.fontSize = size + 'px';
    p.style.writingMode = vert ? 'vertical-rl' : 'horizontal-tb';
    return p;
    */
    const text = {
      x: x,
      y: y,
      font: font,
      size: size,
      vert: vert,
      innerHTML: 'んん'
    };
    return text;
  }

  static shallowEqual(obj1, obj2) {
    if (obj1 === undefined || obj2 === undefined ||
        obj1 === null || obj2 === null) {
      console.log('shallowEqual', obj1, obj2);
      return;
    }
    return Object.keys(obj1).length === Object.keys(obj2).length &&
           Object.keys(obj1).every(key => obj1[key] === obj2[key]);
  }

  static keyElement(key) {
    return document.getElementById('p' + key);
  }

  static keyRect(key) {
    const element = Text.keyElement(key);
    if (element) {
      console.warn('keyElement', element, element.parentNode, element.parentNode.parentNode);
      const x = element.style.left;
      const y = element.style.top;
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      console.log(x, y, width, height);
    }
    return null;
  }
  
  static hasSameKey(element, element2) {
    const key = parseInt(element.id.replace(/^[pt]/, ''));
    const key2 = parseInt(element2.id.replace(/^[pt]/, ''));
    return (key === key2);
  }
  
  // texts <-> elements

  static sync(element, text) {
    element.innerHTML = text.innerHTML;
    element.style.left = text.x + 'px';
    element.style.top = text.y + 'px';
    element.style.fontSize = text.size + 'px';
    element.style.writingMode = text.vert ? 'vertical-rl' : 'horizontal-tb';
  }
  
  static toText(element, prefix) {
    const text = {
      innerHTML: Text.flatten(element.innerHTML),
      x: parseFloat(element.style.left),
      y: parseFloat(element.style.top),
      size: parseFloat(element.style.fontSize),
      vert: (element.style.writingMode === 'vertical-rl') ? true : false,
    };
    if (prefix && element.id) {
      text.key = parseInt(element.id.replace(/^p/, ''));
    }
    return text;
  }

  static toElement(text, prefix) {
    const element = document.createElement('div');
    element.classList.add('text');

    if (prefix && text.key) {
      element.id = prefix + text.key;
    }
    Text.sync(element, text);
    return element;
  }
  
  static toTexts(elements, prefix) {
    const texts = [];
    if (elements instanceof HTMLElement) {
      if (elements.childNodes.length) {
        elements.childNodes.forEach((element) => {
          if (element.nodeType === 1) {
            texts.push(Text.toText(element, prefix));
          }
        });
      }
    } else {
      // when elements is array of keys
      elements.forEach((key) => {
        const element = document.getElementById('p' + key);
        texts.push(Text.toText(element, prefix));
      })
    }
    return texts;
  }

  static toElements(texts, prefix) {
    const elements = document.createElement('div');
    if (texts.length) {
      texts.forEach((text) => {
        const element = Text.toElement(text, prefix);
        elements.appendChild(element);
      })
    }
    return elements;
  }
}

export { Text };

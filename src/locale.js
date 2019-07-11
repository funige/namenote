class Locale {
  constructor() {
    const dictionary = require('../js/lib/dictionary.js').dictionary;

    for (let key in dictionary) {
      if (navigator.language.indexOf(key) == 0 && dictionary[key]) {
        const dict = dictionary[key];
        this.translate = (string) => {
          return dict[string] || string;
        };
        break;
      }
    }
  }

  translate(string) {
    return string;
  }

  translateHTML(html) {
    return html.replace(/T\((.*?)\)/g, (all, match) => {
      return this.translate(match);
    });
  }
}

const locale = new Locale();
const T = locale.translate;

export { locale, T };

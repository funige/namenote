import { namenote } from './namenote.js';
import { T } from './locale.js';


class Title {
  init() {
    this.set();
  }

  set(title = (namenote.trial) ? `${T('Namenote')} ${T('Trial')}` : T('Namenote')) {
    if (namenote.app) {
      namenote.app.setTitle(title);
    } else {
      document.title = title;
    }
  }
}

const title = new Title();

export { title };

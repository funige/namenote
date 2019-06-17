import { namenote } from './namenote.js';
import { locale } from './locale.js';

window.namenote = namenote;
window.T = locale.translate;
window.PX = (x) => x + 'px';

window.LOG = console.log.bind(window.console);
window.WARN = console.warn.bind(window.console);
window.ERROR = console.error.bind(window.console);


// Extend array object

Array.prototype.move = function(from, to) {
  this.splice(to, 0, this.splice(from, 1)[0]);
};
  
document.addEventListener('DOMContentLoaded', function () {
  namenote.init();
});

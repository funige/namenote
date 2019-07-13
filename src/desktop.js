import { namenote } from './namenote.js';
import { app } from './app.js';


window.namenote = namenote;

document.addEventListener('DOMContentLoaded', function () {
  namenote.app = app;
  namenote.init();
});

import { namenote } from './namenote.js';

window.namenote = namenote;

/*
const $ = require('jquery');
window.jQuery = $;
require('jquery-ui-dist/jquery-ui');
*/

document.addEventListener('DOMContentLoaded', function () {
  namenote.init();
});

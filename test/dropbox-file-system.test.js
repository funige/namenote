import { namenote } from '../src/namenote.js';
import { DropboxFileSystem } from '../src/dropbox-file-system.js';

global.$ = require('jquery');
window.jQuery = $;
require('jquery-ui-dist/jquery-ui');

const fileSystem = new DropboxFileSystem();
const readdir = (url) => {
  return new Promise((resolve, reject) => {
    fileSystem.readdir(url, (err, dirents) => {
      if (err) {
        return reject(err);
      }
      resolve(dirents);
    });
  });
};

test('auth', () => {
  localStorage.setItem('namenote/raw_token', "");
  expect(fileSystem.auth()).toBe(false);

  localStorage.setItem('namenote/raw_token', "xzg77AnvTaAAAAAAAAAAZrK_IvNqQ0DtQVXPAWnfnx0uCy8elMPFaL0l8oAaw-hx");
  expect(fileSystem.auth()).toBe(true);
});

test('readdir', async () => {
  const dirents = await readdir('/');
  expect(dirents.length).toBeGreaterThan(1);
});


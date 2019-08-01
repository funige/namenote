jest.mock('../src/file.js');

import { projectManager } from '../src/project-manager.js';
import { pageManager } from '../src/page-manager.js';

global.$ = require('jquery');
window.jQuery = $;
require('jquery-ui-dist/jquery-ui');

test('get', async () => {
  const url = 'dropbox:///mock/mock.namenote';
  const project = await projectManager.get(url);
  expect(pageManager.pages[url][1234]).not.toBeDefined();

  const page = pageManager.get(project, 1234);
  expect(pageManager.pages[url][1234]).toBe(page);
});

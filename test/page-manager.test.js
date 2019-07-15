jest.mock('../src/file.js');

import { projectManager } from '../src/project-manager.js';
import { pageManager } from '../src/page-manager.js';

global.$ = require('jquery');
window.jQuery = $;
require('jquery-ui-dist/jquery-ui');

test('get', async () => {
  const project = await projectManager.get('dropbox:///mock/mock.namenote');
  expect(pageManager.pages.length).toBe(project.params.page_count);

  const page = pageManager.get(project, 1234);
  expect(page.pid).toBe(1234);
  expect(pageManager.pages.length).toBe(project.params.page_count + 1);
});

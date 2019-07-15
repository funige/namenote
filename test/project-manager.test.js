jest.mock('../src/file.js');
jest.mock('../src/shape.js');

import { projectManager } from '../src/project-manager.js';
import { dummy } from '../src/__mocks__/file.js';

global.$ = require('jquery');
window.jQuery = $;
require('jquery-ui-dist/jquery-ui');


test('get', async () => {
  expect(projectManager.projects.length).toBe(0);

  const project = await projectManager.get('dropbox:///mock/mock.namenote');
  expect(project.params.page_count).toBe(15);
  expect(projectManager.projects.length).toBe(1);
});


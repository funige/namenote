import { file } from '../src/file.js';
import { namenote } from '../src/namenote.js';

global.$ = require('jquery');
window.jQuery = $;
require('jquery-ui-dist/jquery-ui');


beforeEach(() => {
  namenote.app = null;
  namenote.homePath = 'foo';
});

test('getSchame returns "dropbox" or "file"', () => {
  expect(file.getDefaultScheme()).toBe('dropbox');
  namenote.app = true;
  expect(file.getDefaultScheme()).toBe('file');
});

test('getHome returns "dropbox:/// or file:///"', () => {
  expect(file.getHome()).toBe('dropbox:///');
  namenote.app = true;
  expect(file.getHome()).toBe('file://foo/');
});

test('truncateURL returns display name for the project url', () => {
  expect(file.truncateURL('foo/bar/baz.namenote')).toBe('bar');
  expect(file.truncateURL('foo/bar/')).toBe('bar');
  expect(file.truncateURL('/foo/bar')).toBe('bar');
});


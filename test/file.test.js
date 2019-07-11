import { file } from '../src/file.js';
import { namenote } from '../src/namenote.js';


beforeEach(() => {
  namenote.app = null;
  namenote.homePath = "foo";
})

test('default scheme is "dropbox" or "file"', () => {
  expect(file.getDefaultScheme()).toBe('dropbox');
  namenote.app = true;
  expect(file.getDefaultScheme()).toBe('file');
});

test('home is "dropbox:/// or file:///"', () => {
  expect(file.getHome()).toBe('dropbox:///');
  namenote.app = true;
  expect(file.getHome()).toBe('file://foo/');
});

test('truncateURL returns display name of the project url', () => {
  expect(file.truncateURL('foo/bar/baz.namenote')).toBe('bar');
  expect(file.truncateURL('foo/bar/')).toBe('bar');
  expect(file.truncateURL('/foo/bar')).toBe('bar');
});

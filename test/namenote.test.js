import { namenote } from '../src/namenote.js';
const json = require('../package.json');

global.$ = require('jquery');

test('read package.json', () => {
  expect(namenote.version).toBe(json.version);
  expect(namenote.trial).toBe(json.trial);
});

test('find duplicate id', () => {
  const spy = jest.spyOn(console, 'error').mockImplementation(() => {});

  document.body.innerHTML = `
    <div id='hoge'></div>
    <div id='hoge'></div>`;
  namenote.findDuplicateID()
  expect(console.error).toHaveBeenCalledTimes(1);
  expect(spy.mock.calls[0][0]).toContain('Multiple IDs #hoge');
  spy.mockRestore();
});


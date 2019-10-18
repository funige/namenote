import { title } from '../src/title.js';
import { namenote } from '../src/namenote.js';
import { T } from '../src/locale.js';


beforeEach(() => {
  namenote.app = null;
  namenote.trial = false;
});

test('update title', () => {
  title.init();
  expect(document.title).toBe(T('Namenote'));
  namenote.trial = true;
  title.set();
  expect(document.title).toBe(`${T('Namenote')} ${T('Trial')}`);
});

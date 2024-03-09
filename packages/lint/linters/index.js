import eslint from './eslint.js';
import markdown from './markdown.js';
import * as util from '../util.js';

const debug = util.debug('linters');

export default function runLinters(fix) {
  Object.entries({
    eslint,
    markdown,
  }).forEach(([name, lint]) => {
    debug(`running linter ${name}`);
    lint(fix);
  });
}

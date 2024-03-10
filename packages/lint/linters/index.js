import eslint from './eslint.js';
import markdown from './markdown.js';
import * as util from '../util.js';

const debug = util.debug('linters');

export default function runLinters(fix) {
  let allSuccess = true;
  Object.entries({
    eslint,
    markdown,
  }).forEach(([name, lint]) => {
    debug(`running linter ${name}`);
    let success = true;
    try {
      lint(fix);
    } catch (err) {
      success = false;
      allSuccess = false;
      // not logging the error, expecting the specific linters to
      // log all required information back to the user.
      // here just continue and run the other linters, and report on
      // overall success/failure for all linters.
    }
    debug(`linter ${name} completed with ${success ? 'success' : 'failure'}`);
  });
  return allSuccess ? 0 : 1;
}

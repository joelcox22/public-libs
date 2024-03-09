import * as util from '../util.js';

const debug = util.debug('configure-eslint');

export default function configure() {
  const packageJson = util.readJson('package.json');
  if (packageJson.name === '@joelbot/lint') {
    debug("looks like you're working on @joelbot/lint repo, doing some custom stuff to make dev work on the lint package easy");
  } else {
    // todo
  }
  util.writeJson('package.json', packageJson);
}

import * as util from '../util.js';
import * as fs from 'fs';

const debug = util.debug('configure-eslint');

export default function configure() {
  const packageJson = util.readJson('package.json');
  if (packageJson.name === '@joelbot/lint') {
    debug("looks like you're working on @joelbot/lint repo, doing some custom stuff to make dev work on the lint package easy");
  } else {
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies['@joelbot/eslint-config'] = '^1.0.0';
    delete packageJson.eslintConfig;
    fs.writeFileSync('eslint.config.json', "export default from '@joelbot/eslint-config';\n");
  }
  util.writeJson('package.json', packageJson);
}
import * as util from '../util.js';
import * as fs from 'fs';

const debug = util.debug('configure-eslint');

export default function configure() {
  const packageJson = util.readJson('package.json');
  if (packageJson.name === '@joelbot/lint') {
    debug("looks like you're working on @joelbot/lint repo, doing some custom stuff to make dev work on the lint package easy");
  } else {
    debug('updating eslint configuration files');
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies['@joelbot/eslint-config'] = '^1.0.0';
    if (packageJson.eslintConfig) {
      debug('removing eslintConfig from package.json in favour of config via eslint.config.js file');
      delete packageJson.eslintConfig;
    }
    fs.writeFileSync('eslint.config.js', "import config from '@joelbot/eslint-config';\nexport default config;\n");
    const remove = ['.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml'];
    for (const file of remove) {
      if (fs.existsSync(file)) {
        debug('removing older style eslint config file', file);
        fs.unlinkSync(file);
      }
    }
  }
  util.writeJson('package.json', packageJson);
}

import * as util from '../util.js';
import * as fs from 'fs';

const debug = util.debug('configure-eslint');

export const name = 'eslint';

export default function configure() {
  const packageJson = util.readJson('package.json');
  if (packageJson.name === '@joelbot/public-libs') {
    debug("looks like you're working on @joelbot/public-libs repo, doing some custom stuff to make dev work on the lint package easy");
  } else {
    debug('updating eslint configuration files');
    if (packageJson.eslintConfig) {
      debug('removing eslintConfig from package.json in favour of config via eslint.config.js file');
      delete packageJson.eslintConfig;
    }
    fs.writeFileSync('eslint.config.js', "import config from '@joelbot/eslint-config';\nexport default config;\n");
    const remove = ['.eslintrc', '.eslintrc.js', '.eslintrc.json', '.eslintrc.yml', '.eslintrc.yaml', '.eslintignore'];
    for (const file of remove) {
      if (fs.existsSync(file)) {
        debug('removing older style eslint config file', file);
        fs.unlinkSync(file);
      }
    }
  }
  util.writeJson('package.json', packageJson);
}

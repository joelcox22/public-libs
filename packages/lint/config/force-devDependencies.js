import * as root from 'app-root-path';
import * as path from 'path';
import * as util from '../util.js';

const debug = util.debug('force-devDependencies');

export const name = 'force-devDependencies';

export default function configureForcedDevDependencies() {
  const rootPackageJson = util.readJson(path.join(root.path, 'package.json'));
  const packageJson = util.readJson('package.json');
  const force = {};
  if (rootPackageJson.name !== '@joelbot/lint') {
    force['@joelbot/eslint-config'] = '^1.0.0';
    force['@joelbot/lint'] = '^1.0.0';
  } else {
    debug("skipping @joelbot/* dependencies because it looks like you're working on @joelbot/lint repo");
  }
  const optional = ['semantic-release', 'typescript', 'jest', '@types/jest'];
  Object.entries(force).forEach(([name, version]) => {
    if (packageJson.dependencies[name]) {
      delete packageJson.dependencies[name];
    }
    packageJson.devDependencies[name] = version;
  });
  optional.forEach((name) => {
    if (name in packageJson.dependencies) {
      packageJson.devDependencies[name] = packageJson.dependencies[name];
      delete packageJson.dependencies[name];
    }
  });
  util.writeJson('package.json', packageJson);
}

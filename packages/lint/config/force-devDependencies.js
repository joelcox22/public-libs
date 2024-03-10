import * as util from '../util.js';

const debug = util.debug('configure-forced-devDependencies');

export default function configureForcedDevDependencies() {
  const packageJson = util.readJson('package.json');
  if (packageJson.name === '@joelbot/lint') {
    debug("looks like you're working on @joelbot/lint repo, not forcing devDependencies to avoid screwing things up.");
    return;
  }
  debug('updating eslint configuration files');
  const force = {
    '@joelbot/eslint-config': '^1.0.0',
    '@joelbot/lint': '^1.0.0',
  };
  const optional = ['semantic-release', 'typescript'];
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
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
  if (Object.keys(packageJson.dependencies).length === 0) {
    delete packageJson.dependencies;
  }
  if (Object.keys(packageJson.devDependencies).length === 0) {
    delete packageJson.devDependencies;
  }
  util.writeJson('package.json', packageJson);
}

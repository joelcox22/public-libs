import * as glob from 'glob';
import * as util from '../util.js';

const debug = util.debug('configure-semanitc-release');

function applySemanticReleaseConfig(file = 'package.json') {
  debug('applying semantic-release configuration to', file);
  const packageJson = util.readJson(file);
  if (packageJson.workspaces) {
    debug('workspaces detected, applying changes to all packages in the workspace that depend on semantic-release');
    delete packageJson.release;
    packageJson.private = true;
    const workspacePackages = packageJson.workspaces.flatMap((pattern) => glob.sync(pattern + '/package.json'));
    workspacePackages.forEach(applySemanticReleaseConfig);
  } else {
    if (packageJson.dependencies['semantic-release']) {
      debug('semantic-release should be a devDependency, not a dependency, fixing that.');
      packageJson.devDependencies['semantic-release'] = packageJson.dependencies['semantic-release'];
      delete packageJson.dependencies['semantic-release'];
    }
    if (packageJson.devDependencies['semantic-release']) {
      debug('semantic-release is a devDependency, forcing opionated configuration');
      packageJson.release = {
        branches: ['main'],
      };
      packageJson.private = false;
      packageJson.publishConfig = {
        access: 'public',
      };
    } else {
      debug('semantic-release is not a devDependency, ensuring config is removed');
      delete packageJson.release;
      packageJson.private = true;
      delete packageJson.publishConfig;
    }
  }
  util.writeJson(file, packageJson);
}

export default function configure() {
  applySemanticReleaseConfig();
}

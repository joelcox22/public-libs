import * as util from '../util.js';

export const name = 'semantic-release';

export const workspacesSupported = true;

export default function configure(isWorkspaceRoot) {
  const packageJson = util.readJson('package.json');
  if (!('private' in packageJson)) {
    packageJson.private = !!(isWorkspaceRoot && packageJson.workspaces);
  }
  if (isWorkspaceRoot) {
    packageJson.private = true;
  }
  if (packageJson.private) {
    delete packageJson.publishConfig;
    delete packageJson.release;
  } else {
    packageJson.publishConfig = {
      access: 'public',
    };
    packageJson.release = {
      branches: ['main'],
    };
  }
  if (!isWorkspaceRoot) {
    delete packageJson.devDependencies['semantic-release'];
  }
  util.writeJson('package.json', packageJson);
}

import * as util from '../util.js';

export const name = 'packageJson';

export const workspacesSupported = true;

export function pre() {
  const packageJson = util.readJson('package.json');
  packageJson.dependencies = packageJson.dependencies || {};
  packageJson.devDependencies = packageJson.devDependencies || {};
  util.writeJson('package.json', packageJson);
}

export function post() {
  const packageJson = util.readJson('package.json');
  if (Object.keys(packageJson.dependencies).length === 0) {
    delete packageJson.dependencies;
  }
  if (Object.keys(packageJson.devDependencies).length === 0) {
    delete packageJson.devDependencies;
  }
  if (!('type' in packageJson)) {
    packageJson.type = 'module';
  }
  util.writeJson(
    'package.json',
    util.sortKeys(packageJson, [
      'name',
      'version',
      'private',
      'main',
      'description',
      'keywords',
      'author',
      'license',
      'type',
      'scripts',
      'repository',
      'dependencies',
      'devDependencies',
      'optionalDependencies',
      'peerDependencies',
    ]),
  );
}

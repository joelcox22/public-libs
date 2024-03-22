import * as util from '../util.js';

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
  util.writeJson('package.json', packageJson);
}

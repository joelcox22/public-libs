import * as util from '../util.js';
import * as fs from 'fs';

const debug = util.debug('configure-typescript');

export const name = 'typescript';

export default function configure() {
  const packageJson = util.readJson('package.json');
  debug('working on', process.cwd() + '/package.json (' + packageJson.name + ')');
  if (packageJson.name === '@joelbot/public-libs') {
    debug("looks like you're working on @joelbot/public-libs repo, doing nothing");
    return;
  }
  if ('typescript' in packageJson.devDependencies) {
    debug('typescript is a devDependency, setting up tsconfig');
    fs.writeFileSync(
      'tsconfig.json',
      JSON.stringify(
        {
          extends: '@joelbot/tsconfig/tsconfig.json',
        },
        null,
        2,
      ),
    );
    packageJson.devDependencies['@joelbot/tsconfig'] = '^1.0.0';
  } else {
    if (fs.exists('tsconfig.json')) {
      debug('typescript is not a devDependency, removing tsconfig.json');
      fs.rmSync('tsconfig.json');
    } else {
      debug('typescript is not a devDependency, and tsconfig.json does not exist, doing nothing');
    }
  }
  util.writeJson('package.json', packageJson);
}

import * as packageJson from './packageJson.js';
import gitignore from './gitignore.js';
import eslint from './eslint.js';
import prettier from './prettier.js';
import vscode from './vscode.js';
import editorconfig from './editorconfig.js';
import markdown from './markdown.js';
import semanticRelease from './semantic-release.js';
import forceDevDependencies from './force-devDependencies.js';
import jest from './jest.js';
import * as util from '../util.js';

const debug = util.debug('configure');

export default function configure() {
  Object.entries({
    prePackageJson: packageJson.pre,
    forceDevDependencies,
    jest,
    gitignore,
    eslint,
    prettier,
    vscode,
    editorconfig,
    markdown,
    semanticRelease,
    postPackageJson: packageJson.post,
  }).forEach(([name, applyConfig]) => {
    debug(`applying config changes for ${name}`);
    applyConfig();
  });
}

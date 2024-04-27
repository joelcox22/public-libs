import * as path from 'path';
import * as glob from 'glob';
import root from 'app-root-path';
import * as packageJson from './packageJson.js';
import * as gitignore from './gitignore.js';
import * as eslint from './eslint.js';
import * as prettier from './prettier.js';
import * as vscode from './vscode.js';
import * as editorconfig from './editorconfig.js';
import * as markdown from './markdown.js';
import * as semanticRelease from './semantic-release.js';
import * as forceDevDependencies from './force-devDependencies.js';
import * as jest from './jest.js';
import * as cdk from './cdk.js';
import * as util from '../util.js';

const debug = util.debug('configure');

export default function configure() {
  const initialDir = process.cwd();
  try {
    process.chdir(root.path);
    debug('starting in directory', root.path);
    const json = util.readJson('package.json');
    const workspaces = json.workspaces;
    const dirs = [root.path];
    if (workspaces) {
      const workspacePackages = workspaces.flatMap((pattern) => glob.sync(pattern + '/package.json'));
      workspacePackages.forEach((file) => {
        dirs.push(path.join(process.cwd(), file, '..'));
      });
    }
    const plugins = [packageJson, forceDevDependencies, jest, gitignore, eslint, prettier, vscode, editorconfig, markdown, semanticRelease, cdk];
    // eslint-disable-next-line no-inner-declarations
    function exec(plugin, step) {
      if (plugin[step]) {
        if (plugin.workspacesSupported) {
          for (const dir of dirs) {
            debug('executing', step, 'step for', plugin.name, 'in', dir);
            process.chdir(dir);
            plugin[step](dir === root.path);
          }
        } else {
          debug('executing', step, 'step for', plugin.name, 'in', root.path);
          process.chdir(root.path);
          plugin[step](true);
        }
      }
    }
    for (const plugin of plugins) {
      exec(plugin, 'pre');
    }
    for (const plugin of plugins) {
      exec(plugin, 'default');
    }
    const reversed = plugins.reverse();
    for (const plugin of reversed) {
      exec(plugin, 'post');
    }
  } finally {
    process.chdir(initialDir);
  }
}

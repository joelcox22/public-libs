import confiugreEslint from './config/eslint.js';
import configurePrettier from './config/prettier.js';
import configureVscode from './config/vscode.js';
import configureEditorconfig from './config/editorconfig.js';
import configureMarkdownlint from './config/markdown.js';
import eslint from './linters/eslint.js';
import markdown from './linters/markdown.js';
import semanticRelase from './linters/semantic-release.js';
import * as util from './util.js';

const debug = util.debug();

const CI = !util.truthy(process.env.CI);

debug(`CI environment variable is ${CI ? 'truthy' : 'falsy'}`);

let fix = CI;
let updateConfig = CI;

if (updateConfig && process.argv.includes('--no-update-configuration')) {
  debug('--no-update-configuration flag was passed, skipping config file updates.');
  updateConfig = false;
}

if (fix && process.argv.includes('--no-fix')) {
  debug('--no-fix flag was passed, not auto-fixing files');
  fix = false;
}

debug('lint config:', { fix, updateConfig });

if (fix) {
  confiugreEslint();
  configurePrettier();
  configureVscode();
  configureEditorconfig();
  configureMarkdownlint();
}

let failed = false;
failed |= eslint(fix);
failed |= markdown(fix);
failed |= semanticRelase(fix);

if (failed) {
  process.exit(1);
}

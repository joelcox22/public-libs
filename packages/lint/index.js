#!/usr/bin/env node
import { Command } from 'commander';
import configure from './config/index.js';
import lint from './linters/index.js';
import * as util from './util.js';

const debug = util.debug();

const program = new Command();

program.name('lint');
program.description(`@joelbot/lint is a very opinionated linting tool.

Running without arguments will update various configuration files, lint your code and apply recommended fix, and complain about anything it can't fix.

What kind of config does it update automatically?
- eslint & prettier
- markdown lint
- vscode recommended settings & extentions
- editorconfig
- semantic-release
- package.json dependencies that should be devDependencies
- jest configuration
- sort order of package.json keys

The idea is "just run \`yarn lint\`" and try not to think about all the above things (but do review any changes to understand the implications).

This tool is zero-config, and will force my preferences on users. I do not recommend anyone use this tool for their projects at this stage.

See https://github.com/joelcox22/lint for more details.`);

program.option('--no-fix', 'Do not auto-fix lint errors');
program.option('--no-update-configuration', 'Do not update configuration files');

program.action((options) => {
  const CI = util.truthy(process.env.CI);

  debug(`CI environment variable is ${CI ? 'truthy' : 'falsy'}`);

  let updateConfig = !CI;
  let fix = !CI;

  if (!updateConfig) {
    debug('detected as running in CI, skipping config file updates.');
  } else if (!options.updateConfiguration) {
    debug('--no-update-configuration flag was passed, skipping config file updates.');
    updateConfig = false;
  }

  if (!fix) {
    debug('detected as running in CI, not auto-fixing files.');
  } else if (!options.fix) {
    debug('--no-fix flag was passed, not auto-fixing files.');
    fix = false;
  }

  debug('final flags:', { fix, updateConfig });

  if (updateConfig) {
    configure();
  }

  const returnStatus = lint(fix);

  process.exit(returnStatus);
});

program.parse();

#!/usr/bin/env node
import configure from './config/index.js';
import lint from './linters/index.js';
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

if (updateConfig) {
  configure();
}

const returnStatus = lint(fix);

process.exit(returnStatus);

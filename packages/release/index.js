#!/usr/bin/env node

import * as fs from 'fs';
import * as cp from 'child_process';
import root from 'app-root-path';
import Debug from 'debug';

const debug = Debug(`@joelbot/release`);

debug('running in directory', process.cwd());
debug('project root directory is', root.path);

if (!fs.existsSync('package.json')) {
  debug('package.json does not exist, doing nothing');
  process.exit(0);
}

const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));

if (packageJson.workspaces) {
  debug('running in a workspace, looping through workspaces and re-running release');
  const result = cp.spawnSync('yarn', ['workspaces', 'run', 'release'], {
    stdio: 'inherit',
  });
  process.exit(result.status);
}

if (packageJson.publishConfig?.access !== 'public') {
  debug('publishConfig.access is not public, doing nothing');
  process.exit(0);
}

debug('publishConfig.access is public, running semantic-release');

if (process.cwd() !== root.path) {
  debug('running in a workspace folder, using semantic-release-monorepo');
  const result = cp.spawnSync('yarn', ['semantic-release', '-e', 'semantic-release-monorepo'], {
    stdio: 'inherit',
  });
  process.exit(result.status);
} else {
  debug('running semantic-release in project root');
  const result = cp.spawnSync('yarn', ['semantic-release'], {
    stdio: 'inherit',
  });
  process.exit(result.status);
}

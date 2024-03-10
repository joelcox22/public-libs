import * as cp from 'child_process';
import * as util from '../util.js';

const debug = util.debug('linter-eslint');

export default function lint(fix) {
  const eslintCommand = ['eslint'];
  if (fix) eslintCommand.push('--fix');
  eslintCommand.push('.');

  debug('eslint command:', eslintCommand.join(' '));

  const result = cp.spawnSync('npx', eslintCommand, {
    stdio: 'inherit',
  });

  if (result.status !== 0) {
    throw new Error('eslint completed with non-zero exit code');
  }
}

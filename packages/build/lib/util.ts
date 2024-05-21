import Debug from 'debug';
import * as fs from 'fs';
import * as path from 'path';
import * as cp from 'child_process';

export async function* packageDirs() {
  const debug = Debug('@joelbot/build:util:packageDirs');
  debug('finding workspaces from', process.cwd());
  if (!fs.existsSync('package.json')) {
    debug('no package.json found, doing nothing');
    return;
  }
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  if ('workspaces' in packageJson) {
    debug('workspaces are enabled in package.json');
    if (!fs.existsSync('yarn.lock')) {
      console.log('package.json has workspaces enabled, but no yarn.lock file in current directory, doing nothing. try running build from workspace root.');
      // todo: allow running build from non-workspace root directory at some point
      return;
    }
    const yarn = cp.spawnSync('yarn', ['workspaces', 'info']);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const workspaces = Object.values(JSON.parse(yarn.stdout.toString())) as any;
    debug(
      'workspaces', // eslint-disable-next-line @typescript-eslint/no-explicit-any
      workspaces.map((ws: any) => ws.location),
    );
    for (const { location } of workspaces) {
      yield path.join(process.cwd(), location);
    }
  } else {
    debug('workspaces are not enabled in package.json, yielding current directory');
    yield process.cwd();
  }
}

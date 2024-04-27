import * as util from '../util.js';
import * as fs from 'fs';

const debug = util.debug('configure-cdk');

export const name = 'cdk';

export default function configure() {
  const packageJson = util.readJson('package.json');
  if (packageJson.devDependencies['aws-cdk-lib']) {
    debug('aws-cdk-lib is a devDependency, setting up cdk things');
    if (!('aws-cdk' in packageJson.devDependencies)) {
      // add aws-cdk cli to the project dependencies as well if needed
      packageJson.devDependencies['aws-cdk'] = packageJson.devDependencies['aws-cdk-lib'];
    }
    if (!('constructs' in packageJson.devDependencies)) {
      packageJson.devDependencies['constructs'] = '^10.0.0';
    }
    if (!fs.existsSync('cdk.json')) {
      const cdkJson = util.readJson('cdk.json', {
        app: 'tsx cdk/index.ts',
      });
      if (!cdkJson.context) {
        cdkJson.context = {};
      }
      util.writeJson('cdk.json', cdkJson);
    }
    if (!fs.existsSync('cdk/index.ts')) {
      fs.writeFileSync('cdk/index.ts', '// todo\n');
    }
    if (!fs.existsSync('cdk/app.ts')) {
      fs.writeFileSync(
        'cdk/app.ts',
        `import * as cdk from 'aws-cdk-lib';

export const app = new cdk.App();
`,
      );
    }
    util.writeJson('package.json', packageJson);
  } else {
    debug('aws-cdk-lib is not a devDependency, skipping cdk configuration');
  }
}

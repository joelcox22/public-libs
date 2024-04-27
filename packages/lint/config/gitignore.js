import * as fs from 'fs';
import * as util from '../util.js';

export const name = 'gitignore';

export default function configureGitignore() {
  const packageJson = util.readJson('package.json');
  const ignore = util.readLines('.gitignore');
  while (ignore[ignore.length - 1] === '') {
    // remove trailing blank lines
    ignore.splice(ignore.length - 1, 1);
  }
  const ignoreIfExists = ['node_modules', 'cdk.out', 'dist', 'lib', 'coverage', 'yarn-error.log', '.nyc_output', '.eslintcache', '.DS_Store', 'npm-debug.log', '.parcel-cache'];
  for (const maybe of ignoreIfExists) {
    if (fs.existsSync(maybe)) {
      if (!ignore.includes(maybe)) {
        ignore.push(maybe);
      }
    }
  }
  if (packageJson.devDependencies.typescript && !ignore.includes('tsconfig.tsbuildinfo')) {
    ignore.push('tsconfig.tsbuildinfo');
  }
  const removeIfIgnored = ['yarn.lock', 'package-lock.json'];
  for (const remove of removeIfIgnored) {
    const index = ignore.indexOf(remove);
    if (index !== -1) {
      ignore.splice(index, 1);
    }
  }
  ignore.push('');
  util.writeLines('.gitignore', ignore);
}

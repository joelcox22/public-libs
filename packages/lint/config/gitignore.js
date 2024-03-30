import * as fs from 'fs';
import * as util from '../util.js';

export const name = 'gitignore';

export default function configureGitignore() {
  const ignore = util.readLines('.gitignore');
  const ignoreIfExists = ['node_modules', 'cdk.out', 'dist', 'lib', 'coverage', 'yarn-error.log', '.nyc_output', '.eslintcache', '.DS_Store', 'npm-debug.log', '.parcel-cache'];
  for (const maybe of ignoreIfExists) {
    if (fs.existsSync(maybe)) {
      if (!ignore.includes(maybe)) {
        ignore.push(maybe);
      }
    }
  }
  const removeIfIgnored = ['yarn.lock', 'package-lock.json'];
  for (const remove of removeIfIgnored) {
    const index = ignore.indexOf(remove);
    if (index !== -1) {
      ignore.splice(index, 1);
    }
  }
  util.writeLines('.gitignore', ignore);
}

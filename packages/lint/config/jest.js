import * as util from '../util.js';
import * as fs from 'fs';

export default function configureJest() {
  const packageJson = util.readJson('package.json');
  let remove = ['jest.config.js', 'jest.config.ts', 'jest.config.cjs', 'jest.config.cts', 'jest.config.mjs', 'jest.config.mts', 'jest.config.json'];
  if ('jest' in packageJson.devDependencies) {
    const jestVersion = packageJson.devDependencies.jest;
    const jestMajor = jestVersion.replace(/[^\d.].*/, '').split('.')[0];
    const latestJestMajor = `^${jestMajor}.0.0`;
    packageJson.devDependencies['@types/jest'] = latestJestMajor;
    packageJson.devDependencies['ts-jest'] = latestJestMajor;
    const typescript = 'typescript' in packageJson.devDependencies;
    const configFilename = typescript ? 'jest.config.ts' : 'jest.config.mjs';
    remove = remove.filter((name) => name !== configFilename);
    const config = {
      verbose: true,
    };
    if (typescript) {
      fs.writeFileSync(
        configFilename,
        `import type { Config } from 'jest';

const config: Config =  ${JSON.stringify(config, null, 2)};

export default config;
`,
      );
    } else {
      fs.writeFileSync(configFilename, `export default ${JSON.stringify(config, null, 2)};\n`);
    }
  }
  for (const file of remove) {
    if (fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
  }
  delete packageJson.jest;
  util.writeJson('package.json', packageJson);
}

import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import spawn from '@expo/spawn-async';
import esbuild from 'esbuild';
import Debug from 'debug';
import * as util from './util.js';

async function buildLibrary(dir: string) {
  const debug = Debug('@joelbot/build:library');

  const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'));
  if (packageJson.devDependencies?.typescript) {
    debug('typescript is a devDependency, compiling to ESM and CommonJS');

    fs.rmSync(path.join(dir, 'dist'), { force: true, recursive: true });

    const options: Partial<Parameters<typeof esbuild.build>[0]> = {
      entryPoints: [path.join(dir, 'lib/**/*.ts')],
      outdir: path.join(dir, 'dist'),
    };

    const tsconfigPath = path.join(os.tmpdir(), 'tsconfig.json');
    debug('temporary tsconfigPath', tsconfigPath);

    const rootDir = path.join(dir, 'lib');
    const outDir = path.join(dir, 'dist');
    debug('rootDir', rootDir);
    debug('outDir', outDir);

    fs.writeFileSync(
      tsconfigPath,
      JSON.stringify(
        {
          compilerOptions: {
            incremental: false,
            target: 'ESNext',
            jsx: 'react',
            moduleDetection: 'auto',
            moduleResolution: 'NodeNext',
            module: 'NodeNext',
            allowArbitraryExtensions: true,
            declaration: true,
            declarationMap: true,
            sourceMap: false,
            rootDir,
            outDir,
            emitDeclarationOnly: true,
            removeComments: false,
            importsNotUsedAsValues: 'remove',
            downlevelIteration: true,
            emitBOM: true,
            newLine: 'lf',
            stripInternal: true,
            noEmitOnError: true,
            isolatedModules: true,
            allowSyntheticDefaultImports: true,
            allowImportingTsExtensions: false,
            esModuleInterop: true,
            forceConsistentCasingInFileNames: true,
            strict: true,
            skipLibCheck: true,
          },
          include: [path.join(rootDir, '**/*')],
        },
        null,
        2,
      ),
    );

    try {
      await Promise.all([
        // declaration only typescript build
        spawn('yarn', ['tsc', '-p', tsconfigPath], {
          stdio: 'inherit',
        }),
        // ESM
        esbuild.build({
          ...options,
          format: 'esm',
        }),
        // CJS
        esbuild.build({
          ...options,
          format: 'cjs',
          outExtension: {
            '.js': '.cjs',
          },
        }),
      ]);
    } catch (err) {
      process.exit(1);
    }
  } else {
    debug('typescript is not a devDependency, copying lib to dist');
    debug('todo: esbuild js so we get esm+cjs output in dist dir, similar to ts lib output');
    fs.cpSync(path.join(dir, 'lib'), path.join(dir, 'dist'), { recursive: true });
  }
}

async function main() {
  const debug = Debug('@joelbot/build');
  for await (const dir of util.packageDirs()) {
    debug('building in directory', dir);
    const packageJson = JSON.parse(fs.readFileSync(path.join(dir, 'package.json'), 'utf-8'));
    if (packageJson.private) {
      debug('package is private, skipping');
      continue;
    }
    if (packageJson.publishConfig?.access !== 'public') {
      debug('package publishConfig.access is not "public", skipping');
      continue;
    }
    if (packageJson.scripts?.build) {
      debug('custom build script defined in package.json, running that');
      await spawn('yarn', ['build'], {
        stdio: 'inherit',
        cwd: dir,
      });
      continue;
    }
    if (!fs.existsSync(path.join(dir, 'lib'))) {
      debug('lib directory does not exist - nothing to build, skipping');
      continue;
    }
    await buildLibrary(dir);
  }
}

main();

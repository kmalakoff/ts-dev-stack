import path from 'path';
import url from 'url';
import Iterator from 'fs-iterator';
import getTS from 'get-tsconfig-compat';
import resolve from 'resolve';
import rimraf2 from 'rimraf2';
import { constants, createMatcher } from 'ts-swc-transform';
import { binPath, source, spawn } from 'tsds-lib';

const { typeFileRegEx, SKIPS } = constants;

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(resolve.sync('node-version-use/package.json', { basedir: __dirname }), 'nvu');

export default function types(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = source(options);
  const srcDir = path.dirname(path.resolve(cwd, src));
  const dest = path.join(cwd, 'dist', 'types');

  const config = getTS.getTsconfig(path.resolve(cwd, 'tsconfig.json'));
  const matcher = createMatcher(config);
  const tsArgs = [];
  for (const key in config.config.compilerOptions) {
    const value = config.config.compilerOptions[key];
    tsArgs.push(`--${key}`);
    tsArgs.push(Array.isArray(value) ? value.join(',') : value);
  }

  rimraf2(dest, { disableGlob: true }, () => {
    const entries = [];
    const iterator = new Iterator(srcDir);
    iterator.forEach(
      (entry) => {
        if (!entry.stats.isFile()) return;
        if (!matcher(entry.fullPath)) return;
        if (typeFileRegEx.test(entry.basename)) return;
        if (SKIPS.indexOf(entry.basename) >= 0) return;
        entries.push(entry);
      },
      (err) => {
        if (err) return cb(err);

        const files = entries.map((entry) => entry.fullPath);
        let args = ['tsc', ...files, '--declaration', '--emitDeclarationOnly', '--outDir', dest, ...tsArgs];
        if (major < 14) args = [nvu, 'stable', ...args];
        spawn(args[0], args.slice(1), { cwd }, cb);
      }
    );
  });
}

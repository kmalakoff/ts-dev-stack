import path from 'path';
import Iterator from 'fs-iterator';
import getTS from 'get-tsconfig-compat';
import resolve from 'resolve';
import rimraf2 from 'rimraf2';
import { createMatcher } from 'ts-swc-transform';
import { binPath, source, spawn } from 'tsds-lib';

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
    const files = [];
    const iterator = new Iterator(srcDir);
    iterator.forEach(
      (entry, callback) => {
        if (!entry.stats.isFile()) return callback();
        if (!matcher(entry.fullPath)) return callback();
        files.push(entry.fullPath);
        callback();
      },
      { callbacks: true, concurrency: 1024 },
      (err) => {
        if (err) return cb(err);

        let args = ['tsc', ...files, '--declaration', '--emitDeclarationOnly', '--outDir', dest, ...tsArgs];
        if (major < 14) args = [nvu, 'stable', ...args];
        spawn(args[0], args.slice(1), { cwd }, cb);
      }
    );
  });
}

const path = require('path');
const Iterator = require('fs-iterator');
const getTS = require('get-tsconfig-compat');
const { createMatcher } = require('ts-swc-transform');

const rimraf2 = require('rimraf2');
const { source, spawn } = require('tsds-lib');

module.exports = function types(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = source(options);
  const srcFolder = path.dirname(path.resolve(cwd, src));
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
    const iterator = new Iterator(srcFolder);
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
        const args = files.concat(['--declaration', '--emitDeclarationOnly', '--outDir', dest]).concat(tsArgs);
        spawn('tsc', args, { cwd }, cb);
      }
    );
  });
};

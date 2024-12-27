import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import Queue from 'queue-cb';

import { link, unlink } from 'link-unlink';
import resolve from 'resolve';
import rimraf2 from 'rimraf2';
import { binPath, installPath, spawn } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = +process.versions.node.split('.')[0];
const _c8 = binPath(resolve.sync('c8/package.json', { basedir: __dirname }));
const mocha = major < 12 ? binPath(resolve.sync('mocha-compat/package.json', { basedir: __dirname }), '_mocha-compat') : binPath(resolve.sync('mocha/package.json', { basedir: __dirname }), '_mocha');
const loader = binPath(resolve.sync('ts-swc-loaders/package.json', { basedir: __dirname }), 'ts-swc');
const config = path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json');

export default function c8(args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const { _, ...opts } = getopts(args, { stopEarly: true, alias: { config: 'c' } });
  const spawnArgs = [c8];
  if (!opts.config) Array.prototype.push.apply(spawnArgs, ['--config', config]);
  Array.prototype.push(spawnArgs, [mocha, '--watch-extensions', 'ts,tsx']);
  Array.prototype.push(spawnArgs, args);
  if (_.length === 0) Array.prototype.push.apply(spawnArgs, [['test/**/*.test.*']]);
  const dest = path.resolve(cwd, 'coverage');

  link(cwd, installPath(options), (err, restore) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
    queue.defer(spawn.bind(null, loader, spawnArgs, { cwd }));
    queue.await((err) => {
      unlink(restore, (err2) => {
        cb(err || err2);
      });
    });
  });
}

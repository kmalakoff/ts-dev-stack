import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import Queue from 'queue-cb';

import resolve from 'resolve';
import { binPath, installPath, link, spawn, unlink } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = +process.versions.node.split('.')[0];
const mocha = major < 12 ? binPath(resolve.sync('mocha-compat/package.json', { basedir: __dirname }), '_mocha-compat') : binPath(resolve.sync('mocha/package.json', { basedir: __dirname }), '_mocha');
const loader = binPath(resolve.sync('ts-swc-loaders/package.json', { basedir: __dirname }), 'ts-swc');

export default function command(args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const { _ } = getopts(args, { stopEarly: true, alias: {} });
  const spawnArgs = [mocha, '--watch-extensions', 'ts,tsx', ...args];
  if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.*']);

  link(cwd, installPath(options), (err, restore) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer(spawn.bind(null, loader, spawnArgs, { cwd }));
    queue.await((err) => {
      unlink(restore, (err2) => {
        cb(err || err2);
      });
    });
  });
}

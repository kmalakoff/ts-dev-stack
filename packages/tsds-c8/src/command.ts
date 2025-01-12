import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import Queue from 'queue-cb';
import resolve from 'resolve';
import resolveBin from 'resolve-bin-sync';
import rimraf2 from 'rimraf2';
import { installPath } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);

const major = +process.versions.node.split('.')[0];
const config = path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json');
const mochaName = major < 12 ? 'mocha-compat' : 'mocha';

export default function c8(args, options, callback) {
  const cwd = options.cwd || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      const c8 = resolveBin('c8');
      const mocha = resolveBin(mochaName);
      const loader = resolveBin('ts-swc-loaders', 'ts-swc');

      const { _, ...opts } = getopts(args, { stopEarly: true, alias: { config: 'c' } });
      const spawnArgs = [c8];
      if (!opts.config) Array.prototype.push.apply(spawnArgs, ['--config', config]);
      Array.prototype.push.apply(spawnArgs, [mocha, '--watch-extensions', 'ts,tsx']);
      Array.prototype.push.apply(spawnArgs, args);
      if (_.length === 0) Array.prototype.push.apply(spawnArgs, [['test/**/*.test.*']]);
      const dest = path.join(cwd, 'coverage');

      const queue = new Queue(1);
      queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
      queue.defer(spawn.bind(null, loader, spawnArgs, options));
      queue.await((err) => unlink(restore, callback.bind(null, err)));
    } catch (err) {
      console.log(err.message);
      return callback(err);
    }
  });
}

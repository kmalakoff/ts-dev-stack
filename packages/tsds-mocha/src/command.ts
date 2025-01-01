import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import Queue from 'queue-cb';
import resolve from 'resolve';
import resolveBin from 'resolve-bin-sync';
import { installPath } from 'tsds-lib';

const major = +process.versions.node.split('.')[0];
const mochaName = major < 12 ? 'mocha-compat' : 'mocha';

export default function command(args, options, callback) {
  const cwd = options.cwd || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      const loader = resolveBin('ts-swc-loaders', 'ts-swc');
      const mocha = resolveBin(mochaName);

      const { _ } = getopts(args, { stopEarly: true, alias: {} });
      const spawnArgs = [mocha, '--watch-extensions', 'ts,tsx', ...args];
      if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.*']);

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, loader, spawnArgs, options));
      queue.await((err) => unlink(restore, callback.bind(null, err)));
    } catch (err) {
      console.log(err);
      callback(err);
    }
  });
}

import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import Queue from 'queue-cb';
import resolve from 'resolve';
import resolveBin from 'resolve-bin';
import { installPath } from 'tsds-lib';

const major = +process.versions.node.split('.')[0];
const mochaName = major < 12 ? 'mocha-compat' : 'mocha';

export default function command(args, options, callback) {
  const cwd = options.cwd || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      const loaderPackagePath = resolve.sync('ts-swc-loaders/package.json');
      const loader = path.join(path.dirname(loaderPackagePath), JSON.parse(fs.readFileSync(loaderPackagePath, 'utf8')).bin['ts-swc']);
      const mocha = resolveBin.sync(mochaName);

      const { _ } = getopts(args, { stopEarly: true, alias: {} });
      const spawnArgs = [mocha, '--watch-extensions', 'ts,tsx', ...args];
      if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.*']);

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, loader, spawnArgs, options));
      queue.await((err) => unlink(restore, callback.bind(err)));
    } catch (err) {
      callback(err);
    }
  });
}

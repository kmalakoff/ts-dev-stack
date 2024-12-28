import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import { whichAll } from 'module-which';
import Queue from 'queue-cb';
import { installPath, spawn } from 'tsds-lib';

const major = +process.versions.node.split('.')[0];

export default function command(args, options, callback) {
  whichAll([major < 12 ? 'mocha-compat' : 'mocha', 'ts-swc'], options, (err, results) => {
    if (err) return callback(err);
    const [mocha, loader] = results;

    const cwd = options.cwd || process.cwd();
    const { _ } = getopts(args, { stopEarly: true, alias: {} });
    const spawnArgs = [mocha, '--watch-extensions', 'ts,tsx', ...args];
    if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.*']);

    link(cwd, installPath(options), (err, restore) => {
      if (err) return callback(err);

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, loader, spawnArgs, { cwd }));
      queue.await((err) => {
        unlink(restore, (err2) => {
          callback(err || err2);
        });
      });
    });
  });
}

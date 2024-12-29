import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import which from 'module-which';
import Queue from 'queue-cb';
import resolve from 'resolve';
import { installPath } from 'tsds-lib';

const major = +process.versions.node.split('.')[0];
const mocha = major < 12 ? 'mocha-compat' : 'mocha';

export default function command(args, options, callback) {
  which('ts-swc', options, (err, loader) => {
    if (err) return callback(err);

    try {
      const mochaPath = resolve.sync(`${mocha}/bin/${mocha}`);
      const cwd = options.cwd || process.cwd();
      const { _ } = getopts(args, { stopEarly: true, alias: {} });
      const spawnArgs = [mochaPath, '--watch-extensions', 'ts,tsx', ...args];
      if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.*']);

      link(cwd, installPath(options), (err, restore) => {
        if (err) return callback(err);
        const queue = new Queue(1);
        queue.defer(spawn.bind(null, loader, spawnArgs, { cwd, stdio: 'inherit' }));
        queue.await((err) => {
          unlink(restore, (err2) => {
            callback(err || err2);
          });
        });
      });
    } catch (err) {
      callback(err);
    }
  });
}

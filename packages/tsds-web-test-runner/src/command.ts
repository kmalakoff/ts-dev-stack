import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import moduleRoot from 'module-root-sync';
import which from 'module-which';
import Queue from 'queue-cb';
import { installPath, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(moduleRoot(__dirname), 'dist', 'cjs', 'command.js'));
const config = path.resolve(moduleRoot(__dirname), 'dist', 'esm', 'wtr.config.mjs');

function worker(args, options, callback) {
  which('wtr', options, (err, wtr) => {
    if (err) return callback(err);
    const cwd = options.cwd || process.cwd();
    const { _, ...opts } = getopts(args, { stopEarly: true, alias: { config: 'c' } });
    const spawnArgs = [wtr];
    if (!opts.config) Array.prototype.push.apply(spawnArgs, ['--config', config]);
    Array.prototype.push.apply(spawnArgs, args);
    if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.{ts,tsx,jsx,mjs}']);

    link(cwd, installPath(options), (err, restore) => {
      if (err) return callback(err);

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, spawnArgs[0], spawnArgs.slice(1), options));
      queue.await((err) => {
        unlink(restore, (err2) => {
          callback(err || err2);
        });
      });
    });
  });
}

export default function testBrowser(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

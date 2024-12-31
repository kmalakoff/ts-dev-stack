import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import { link, unlink } from 'link-unlink';
import moduleRoot from 'module-root-sync';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import { installPath, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(moduleRoot(__dirname), 'dist', 'cjs', 'command'));
const config = path.resolve(moduleRoot(__dirname), 'dist', 'esm', 'wtr.config.mjs');

function worker(args, options, callback) {
  const cwd = options.cwd || process.cwd();

  link(cwd, installPath(options), (err, restore) => {
    if (err) return callback(err);

    try {
      const wtr = resolveBin('@web/test-runner', 'wtr');
      const { _, ...opts } = getopts(args, { stopEarly: true, alias: { config: 'c' } });
      const spawnArgs = [wtr];
      if (!opts.config) Array.prototype.push.apply(spawnArgs, ['--config', config]);
      Array.prototype.push.apply(spawnArgs, args);
      if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.{ts,tsx,jsx,mjs}']);

      const queue = new Queue(1);
      queue.defer(spawn.bind(null, spawnArgs[0], spawnArgs.slice(1), options));
      queue.await((err) => unlink(restore, callback.bind(err)));
    } catch (err) {
      callback(err);
    }
  });
}

export default function testBrowser(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

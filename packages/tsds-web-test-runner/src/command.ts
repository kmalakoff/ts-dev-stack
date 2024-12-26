import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import Queue from 'queue-cb';
import resolve from 'resolve';
import { binPath, installPath, link, packageRoot, spawn, unlink, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'command.js'));
const wtr = binPath(resolve.sync('@web/test-runner/package.json', { basedir: __dirname }), 'web-test-runner');
const config = path.resolve(packageRoot(__dirname), 'dist', 'esm', 'wtr.config.mjs');

function worker(args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const { _, ...opts } = getopts(args, { stopEarly: true, alias: { config: 'c' } });
  const spawnArgs = [wtr];
  if (!opts.config) Array.prototype.push.apply(spawnArgs, ['--config', config]);
  Array.prototype.push.apply(spawnArgs, args);
  if (_.length === 0) Array.prototype.push.apply(spawnArgs, ['test/**/*.test.{ts,tsx,jsx,mjs}']);

  link(cwd, installPath(options), (err) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer(spawn.bind(null, spawnArgs[0], spawnArgs.slice(1), { cwd }));
    queue.await((err) => {
      unlink(cwd, (err2) => {
        cb(err || err2);
      });
    });
  });
}

export default function testBrowser(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

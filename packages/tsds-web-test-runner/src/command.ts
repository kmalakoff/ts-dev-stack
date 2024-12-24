import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import Queue from 'queue-cb';
import resolve from 'resolve';
import { binPath, installPath, link, optionsToArgs, packageRoot, spawn, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'command.js'));
const wtr = binPath(resolve.sync('@web/test-runner/package.json', { basedir: __dirname }), 'web-test-runner');
const config = path.resolve(packageRoot(__dirname), 'dist', 'esm', 'wtr.config.mjs');

function worker(_args, _options, cb) {
  const cwd = _options.cwd || process.cwd();

  let options = getopts(_args, { stopEarly: true, alias: { temp: 't' } });
  _args = options._;

  options = { ...options };
  options.cwd = undefined;

  const args = [wtr];
  Array.prototype.push.apply(args, optionsToArgs(options));
  if (!options.config) Array.prototype.push.apply(args, optionsToArgs({ config }));
  Array.prototype.push.apply(args, _args.length ? _args.slice(-1) : ['test/**/*.test.{ts,tsx,jsx,mjs}']);

  link(installPath(options), (_err, restore) => {
    const queue = new Queue(1);
    queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
}

export default function testBrowser(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

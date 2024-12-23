import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import Queue from 'queue-cb';
import resolve from 'resolve';
import { binPath, installPath, link, optionsToArgs, packageRoot, spawn } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = +process.versions.node.split('.')[0];
const nvu = binPath(resolve.sync('node-version-use/package.json', { basedir: __dirname }), 'nvu');
const wtr = binPath(resolve.sync('@web/test-runner/package.json', { basedir: __dirname }), 'web-test-runner');
const config = path.resolve(packageRoot(__dirname), 'dist', 'esm', 'wtr.config.mjs');

export default function command(_args, _options, cb) {
  const cwd = _options.cwd || process.cwd();

  let options = getopts(_args, { stopEarly: true, alias: { temp: 't' } });
  _args = options._;

  options = { ...options };
  options.cwd = undefined;

  link(installPath(options), (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      let args = [wtr];
      Array.prototype.push.apply(args, optionsToArgs(options));
      if (!options.config) Array.prototype.push.apply(args, optionsToArgs({ config }));
      Array.prototype.push.apply(args, _args.length ? _args.slice(-1) : ['test/**/*.test.{ts,tsx,jsx,mjs}']);
      if (major < 14) args = [nvu, 'stable', ...args];
      spawn(args[0], args.slice(1), { cwd }, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
}

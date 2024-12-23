import path from 'path';
import url from 'url';
import Queue from 'queue-cb';

import resolve from 'resolve';
import { binPath, installPath, link, optionsToArgs, spawn } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = +process.versions.node.split('.')[0];
const mocha = major < 12 ? binPath(resolve.sync('mocha-compat/package.json', { basedir: __dirname }), '_mocha-compat') : binPath(resolve.sync('mocha/package.json', { basedir: __dirname }), '_mocha');
const loader = binPath(resolve.sync('ts-swc-loaders/package.json', { basedir: __dirname }), 'ts-swc');

export default function command(_args, options, cb) {
  const cwd = options.cwd || process.cwd();

  link(installPath(options), (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      const args = [mocha, '--watch-extensions', 'ts,tsx'];
      Array.prototype.push.apply(args, optionsToArgs(options));
      Array.prototype.push.apply(args, _args.length ? _args.slice(-1) : ['test/**/*.test.*']);
      spawn(loader, args, { cwd }, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
}
export const options = { alias: { temp: 't' } };

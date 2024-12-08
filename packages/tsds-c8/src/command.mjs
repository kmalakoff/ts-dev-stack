import path from 'path';
import Queue from 'queue-cb';

import resolve from 'resolve';
import rimraf2 from 'rimraf2';
import { binPath, installPath, link, optionsToArgs, spawn } from 'tsds-lib';

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const _c8 = binPath(resolve.sync('c8/package.json', { basedir: __dirname }));
const mocha = major < 12 ? binPath(resolve.sync('mocha-compat/package.json', { basedir: __dirname }), '_mocha-compat') : binPath(resolve.sync('mocha/package.json', { basedir: __dirname }), '_mocha');
const loader = binPath(resolve.sync('ts-swc-loaders/package.json', { basedir: __dirname }), 'ts-swc');

export default function c8(_args, options, cb) {
  const cwd = options.cwd || process.cwd();

  link(installPath(options), (err, restore) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer((cb) => {
      rimraf2(path.resolve(process.cwd(), { disableGlob: true }, 'coverage'), () => {
        cb();
      });
    });
    queue.defer((cb) => {
      const args = [loader, c8, '--config', path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json')];
      Array.prototype.push(args, [mocha, '--watch-extensions', 'ts,tsx']);
      Array.prototype.push.apply(args, optionsToArgs(options));
      Array.prototype.push.apply(args, _args.length ? _args.slice(-1) : ['test/**/*.test.*']);
      spawn(args[0], args.slice(1), { cwd }, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
}

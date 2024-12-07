import Queue from 'queue-cb';

import requireResolve from 'resolve/sync';
import { binPath, installPath, link, optionsToArgs, spawn } from 'tsds-lib';

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const mocha = major < 12 ? binPath(requireResolve('mocha-compat/package.json', { basedir: __dirname }), '_mocha-compat') : binPath(requireResolve('mocha/package.json', { basedir: __dirname }), '_mocha');
const loader = binPath(requireResolve('ts-swc-loaders/package.json', { basedir: __dirname }), 'ts-swc');

export default function command(_args, options, cb) {
  const cwd = options.cwd || process.cwd();

  link(installPath(options), (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      let args = [mocha, '--watch-extensions', 'ts,tsx'];
      args = args.concat(optionsToArgs(options));
      args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
      spawn(loader, args, { cwd }, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
}

module.exports.options = { alias: { temp: 't' } };

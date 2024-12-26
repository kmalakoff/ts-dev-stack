import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { config } from 'tsds-lib';
import transformDirectory from './lib/transformDirectory.js';
import types from './lib/types.js';
import umd from './lib/umd.js';

export default function build(args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const { targets } = config(options);
  const clean = options.clean === undefined ? true : options.clean;
  const dest = path.join(cwd, 'dist');
  const queue = new Queue(1);
  !clean || queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  targets.indexOf('cjs') < 0 || queue.defer(transformDirectory.bind(null, args, 'cjs', options));
  targets.indexOf('esm') < 0 || queue.defer(transformDirectory.bind(null, args, 'esm', options));
  targets.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
  queue.defer(types.bind(null, args, options));
  queue.await(cb);
}

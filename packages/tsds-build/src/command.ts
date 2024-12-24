import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { config } from 'tsds-lib';
import cjs from './build/cjs.js';
import esm from './build/esm.js';
import types from './build/types.js';
import umd from './build/umd.js';

export default function build(args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const { targets } = config(options);
  const clean = options.clean === undefined ? true : options.clean;
  const dest = path.join(cwd, 'dist');
  const queue = new Queue(1);
  !clean || queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  targets.indexOf('cjs') < 0 || queue.defer(cjs.bind(null, args, options));
  targets.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
  targets.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
  queue.defer(types.bind(null, args, options));
  queue.await(cb);
}

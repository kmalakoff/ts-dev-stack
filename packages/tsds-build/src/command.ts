import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { targets } from 'tsds-lib';
import cjs from './build/cjs.js';
import esm from './build/esm.js';
import types from './build/types.js';
import umd from './build/umd.js';

export default function build(args, options, cb) {
  const targs = targets(options);
  const clean = options.clean === undefined ? true : options.clean;

  const cwd = options.cwd || process.cwd();
  const queue = new Queue(1);
  !clean || queue.defer((cb) => rimraf2(path.join(cwd, 'dist'), { disableGlob: true }, cb.bind(null, null)));
  targs.indexOf('cjs') < 0 || queue.defer(cjs.bind(null, args, options));
  targs.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
  targs.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
  queue.defer(types.bind(null, args, options));
  queue.await(cb);
}

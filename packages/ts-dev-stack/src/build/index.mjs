import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { targets } from 'tsds-lib';
import cjs from './cjs.mjs';
import esm from './esm.mjs';
import types from './types.mjs';
import umd from './umd.mjs';

export default function build(args, options, cb) {
  const targs = targets(options);

  const cwd = options.cwd || process.cwd();
  rimraf2(path.join(cwd, 'dist'), { disableGlob: true }, () => {
    const queue = new Queue(1);
    targs.indexOf('cjs') < 0 || queue.defer(cjs.bind(null, args, options));
    targs.indexOf('esm') < 0 || queue.defer(esm.bind(null, args, options));
    targs.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
    queue.defer(types.bind(null, args, options));
    queue.await(cb);
  });
}

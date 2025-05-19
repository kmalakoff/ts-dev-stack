import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { loadConfig } from 'tsds-lib';
import { DEFAULT_TARGETS } from './constants.js';
import files from './lib/files.js';
import umd from './lib/umd.js';

export default function build(args, options, callback) {
  const config = loadConfig(options);
  if (!config) {
    console.log('tsds: no config. Skipping');
    return callback();
  }
  const cwd = options.cwd || process.cwd();
  const targets = config.targets || DEFAULT_TARGETS;
  const clean = options.clean === undefined ? true : options.clean;
  const dest = path.join(cwd, 'dist');
  const queue = new Queue(1);
  !clean || queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  targets.indexOf('cjs') < 0 || queue.defer(files.bind(null, args, 'cjs', options));
  targets.indexOf('esm') < 0 || queue.defer(files.bind(null, args, 'esm', options));
  targets.indexOf('umd') < 0 || queue.defer(umd.bind(null, args, options));
  queue.await(callback);
}

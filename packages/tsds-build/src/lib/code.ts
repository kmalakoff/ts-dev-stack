import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformDirectory } from 'ts-swc-transform';
import { loadConfig } from 'tsds-lib';

const MAX_FILES = 10;
const reportFn = (dest, type, cb) => (err, results) => {
  if (err) console.log(`${type} failed: ${err.message}`);
  else console.log(`Created ${results.length < MAX_FILES ? results.map((x) => `dist/${type}/${path.relative(dest, x)}`).join(',') : `${results.length} files in dist/${type}`}`);
  cb(err);
};

export default function code(_args, type, options, callback) {
  const config = loadConfig(options);
  if (!config) {
    console.log('tsds: no config. Skipping');
    return callback();
  }
  if (!config.source) {
    console.log(`tsds: config missing source. Skipping code: ${type}`);
    return callback();
  }

  const cwd = options.cwd || process.cwd();
  const src = path.dirname(path.join(cwd, config.source));
  const dest = path.join(cwd, 'dist', type);

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer((cb) => transformDirectory(src, dest, type, { ...options, type, extensions: { cjs: '.cjs', esm: '.mjs' }, sourceMaps: true }, reportFn(dest, type, cb)));
  queue.await(callback);
}

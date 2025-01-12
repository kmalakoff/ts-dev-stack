import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformDirectory, transformTypes, ConfigOptions } from 'ts-swc-transform';

const MAX_FILES = 10;
const reportFn = (dest, type, cb) => (err, results) => {
  if (err) console.log(`${type} failed: ${err.message}`);
  else console.log(`Created ${results.length < MAX_FILES ? results.map((x) => `dist/${type}/${path.relative(dest, x)}`).join(',') : `${results.length} files in dist/${type}`}`);
  cb(err);
};

export default function build(callback) {
  const cwd = process.cwd();
  const config = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8')).tsds;
  const src = path.dirname(path.join(cwd, config.source));
  const dest = path.join(cwd, 'dist');
  const options = { extensions: { cjs: '.cjs', esm: '.mjs' }, sourceMaps: true } as ConfigOptions;

  const queue = new Queue(1);
  queue.defer(rimraf2.bind(null, dest, { disableGlob: true }));
  queue.defer((cb) => transformDirectory(src, path.join(dest, 'cjs'), 'cjs', options, reportFn(dest, 'cjs', cb)));
  queue.defer((cb) => transformDirectory(src, path.join(dest, 'esm'), 'esm', options, reportFn(dest, 'esm', cb)));
  queue.defer((cb) => transformTypes(src, path.join(dest, 'types'), reportFn(dest, 'types', cb)));
  queue.await(callback);
}

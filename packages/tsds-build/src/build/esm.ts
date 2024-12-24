import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformDirectory } from 'ts-swc-transform';
import { config } from 'tsds-lib';

export default function esm(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.dirname(path.resolve(cwd, config(options).source));
  const dest = path.join(cwd, 'dist', 'esm');

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer(transformDirectory.bind(null, src, dest, 'esm', { ...options, type: 'esm', sourceMaps: true }));
  queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"module"}'));
  queue.await(cb);
}

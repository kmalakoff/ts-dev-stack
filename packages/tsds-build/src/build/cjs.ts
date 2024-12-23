import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformDirectory } from 'ts-swc-transform';
import { config } from 'tsds-lib';

export default function cjs(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.dirname(path.resolve(cwd, config(options).source));
  const dest = path.join(cwd, 'dist', 'cjs');

  rimraf2(dest, { disableGlob: true }, () => {
    const queue = new Queue(1);
    queue.defer(transformDirectory.bind(null, src, dest, 'cjs', { ...options, type: 'cjs', sourceMaps: true }));
    queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
    queue.await(cb);
  });
}

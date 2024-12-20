import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformDirectory } from 'ts-swc-transform';
import { source } from 'tsds-lib';

// @ts-ignore
import process from '../lib/process.cjs';

export default function cjs(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = source(options);
  const srcDir = path.dirname(path.resolve(cwd, src));
  const dest = path.join(cwd, 'dist', 'cjs');

  rimraf2(dest, { disableGlob: true }, () => {
    const queue = new Queue(1);
    queue.defer(transformDirectory.bind(null, srcDir, dest, 'cjs', { ...options, type: 'cjs', sourceMaps: true }));
    queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
    queue.await(cb);
  });
}

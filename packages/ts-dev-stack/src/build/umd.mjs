import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';

import rimraf2 from 'rimraf2';
import { source, spawn } from 'tsds-lib';

function root(dir) {
  if (path.basename(dir) === 'ts-dev-stack') return dir;
  const nextDir = path.dirname(dir);
  if (nextDir === dir) throw new Error('ts-dev-stack not found');
  return root(nextDir);
}

export default function umd(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.resolve(cwd, source(options));

  options = { ...options };
  options.type = 'umd';
  options.sourceMaps = true;
  options.dest = path.join(cwd, 'dist', 'umd');
  rimraf2(options.dest, { disableGlob: true }, () => {
    const queue = new Queue(1);
    queue.defer(spawn.bind(null, 'rollup', ['--config', path.resolve(root(__dirname), 'dist', 'esm', 'rollup-swc', 'index.mjs'), '--input', src], { cwd }));
    queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
    queue.await(cb);
  });
}

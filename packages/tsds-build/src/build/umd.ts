import fs from 'fs';
import path from 'path';
import url from 'url';
import Queue from 'queue-cb';
import resolve from 'resolve';
import rimraf2 from 'rimraf2';
import { binPath, packageRoot, source, spawn } from 'tsds-lib';

// @ts-ignore
import process from '../lib/process.cjs';
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(resolve.sync('node-version-use/package.json', { basedir: __dirname }), 'nvu');
const config = path.resolve(packageRoot(__dirname), 'dist', 'esm', 'rollup.config.mjs');

export default function umd(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.resolve(cwd, source(options));
  const dest = path.join(cwd, 'dist', 'umd');

  rimraf2(dest, { disableGlob: true }, () => {
    const queue = new Queue(1);
    (() => {
      let args = ['rollup', '--config', config, '--input', src];
      if (major < 14) args = [nvu, 'stable', ...args];
      queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
    })();
    queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
    queue.await(cb);
  });
}

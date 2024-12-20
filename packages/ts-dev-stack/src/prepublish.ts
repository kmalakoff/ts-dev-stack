import path from 'path';
import url from 'url';
import Queue from 'queue-cb';
import format from 'tsds-biome';
import build from 'tsds-build';

import resolve from 'resolve';
import { binPath, spawn } from 'tsds-lib';

// @ts-ignore
import process from './lib/process.cjs';
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(resolve.sync('node-version-use/package.json', { basedir: __dirname }), 'nvu');

export default function prepublish(args, options, cb) {
  const cwd = options.cwd || process.cwd();

  const queue = new Queue(1);
  queue.defer(format.bind(null, args, options));
  queue.defer(build.bind(null, args, options));

  (() => {
    let args = ['sort-package-json'];
    if (major < 14) args = [nvu, 'stable', ...args];
    queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
  })();
  (() => {
    let args = ['depcheck'];
    if (major < 14) args = [nvu, 'stable', ...args];
    queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
  })();

  queue.await(cb);
}

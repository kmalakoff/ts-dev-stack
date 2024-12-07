import Queue from 'queue-cb';
import format from 'tsds-biome';
import build from 'tsds-build';

import requireResolve from 'resolve/sync';
import { binPath, spawn } from 'tsds-lib';

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(requireResolve('node-version-use/package.json', { basedir: __dirname }), 'nvu');

export default function predeploy(args, options, cb) {
  const cwd = options.cwd || process.cwd();

  const queue = new Queue(1);
  queue.defer(format.bind(null, args, options));
  queue.defer(build.bind(null, args, options));

  (() => {
    let args = ['sort-package-json'];
    if (major < 14) args = [nvu, 'stable'].concat(args);
    queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
  })();
  (() => {
    let args = ['depcheck'];
    if (major < 14) args = [nvu, 'stable'].concat(args);
    queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
  })();

  queue.await(cb);
}

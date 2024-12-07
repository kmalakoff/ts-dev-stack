import path from 'path';
import mkdirp from 'mkdirp';
import Queue from 'queue-cb';

import requireResolve from 'resolve/sync';
import rimraf2 from 'rimraf2';
import { binPath, source, spawn } from 'tsds-lib';

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(requireResolve('node-version-use/package.json', { basedir: __dirname }), 'nvu');

export default function format(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = source(options);
  const dest = path.resolve(process.cwd(), 'docs');

  let args = ['typedoc', src];
  if (major < 14) args = [nvu, 'stable'].concat(args);

  rimraf2(dest, { disableGlob: true }, () => {
    const queue = new Queue(1);
    queue.defer(mkdirp.bind(null, dest));
    queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
    queue.await(cb);
  });
}

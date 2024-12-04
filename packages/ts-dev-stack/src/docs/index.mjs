import path from 'path';
import mkdirp from 'mkdirp';
import Queue from 'queue-cb';

import rimraf2 from 'rimraf2';
import { source, spawn } from 'tsds-lib';

export default function docs(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = source(options);
  const dest = path.resolve(process.cwd(), 'docs');

  rimraf2(dest, { disableGlob: true }, () => {
    const queue = new Queue(1);
    queue.defer(mkdirp.bind(null, dest));
    queue.defer(spawn.bind(null, 'typedoc', [src], { cwd }));
    queue.await(cb);
  });
}

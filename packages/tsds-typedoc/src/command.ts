import path from 'path';
import url from 'url';
import mkdirp from 'mkdirp-classic';
import Queue from 'queue-cb';

import resolve from 'resolve';
import rimraf2 from 'rimraf2';
import { binPath, source, spawn } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = +process.versions.node.split('.')[0];
const nvu = binPath(resolve.sync('node-version-use/package.json', { basedir: __dirname }), 'nvu');

export default function format(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = source(options);
  const dest = path.resolve(process.cwd(), 'docs');

  rimraf2(dest, { disableGlob: true }, () => {
    const queue = new Queue(1);
    queue.defer(mkdirp.bind(null, dest));
    (() => {
      let args = ['typedoc', src];
      if (major < 14) args = [nvu, 'stable', ...args];
      queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
    })();
    queue.await(cb);
  });
}

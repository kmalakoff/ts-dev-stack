import path from 'path';
import url from 'url';
import mkdirp from 'mkdirp-classic';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { config, packageRoot, spawn, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'command.js'));

function worker(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const source = config(options).source;
  const dest = path.resolve(process.cwd(), 'docs');

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer(mkdirp.bind(null, dest));
  queue.defer(spawn.bind(null, 'typedoc', [source], { cwd }));
  queue.await(cb);
}

export default function docs(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

import path from 'path';
import url from 'url';
import Queue from 'queue-cb';
import format from 'tsds-biome';
import build from 'tsds-build';
import { packageRoot, spawn, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'commands', 'prepublish.js'));

function worker(args, options, cb) {
  const cwd = options.cwd || process.cwd();

  const queue = new Queue(1);
  queue.defer(format.bind(null, args, options));
  queue.defer(build.bind(null, args, options));
  queue.defer(spawn.bind(null, 'sort-package-json', [], { cwd }));
  queue.defer(spawn.bind(null, 'depcheck', [], { cwd }));
  queue.await(cb);
}

export default function prepublish(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

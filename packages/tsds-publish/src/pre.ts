import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.cjs'));

function worker(_args, options, callback) {
  const cwd = options.cwd || process.cwd();

  const queue = new Queue(1);
  queue.defer(rimraf2.bind(null, path.join(cwd, 'node_modules'), { disableGlob: true }));
  queue.defer(spawn.bind(null, 'npm', ['ci'], { ...options, cwd }));
  queue.defer(spawn.bind(null, 'npm', ['test'], { ...options, cwd }));
  queue.await(callback);
}

export default function pre(args, options, callback) {
  major < 0 ? workerWrapper(version, args, options, callback) : worker(args, options, callback);
}

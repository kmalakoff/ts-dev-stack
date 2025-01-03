import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import mkdirp from 'mkdirp-classic';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import rimraf2 from 'rimraf2';
import { config, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command'));

function worker(args, options, callback) {
  try {
    const typedoc = resolveBin('typedoc');
    const source = config(options).source;
    const dest = path.join(process.cwd(), 'docs');

    const queue = new Queue(1);
    queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
    queue.defer(mkdirp.bind(null, dest));
    queue.defer(spawn.bind(null, typedoc, [source, ...args, '--excludeExternals', 'true'], options));
    queue.await(callback);
  } catch (err) {
    return callback(err);
  }
}

export default function docs(args, options, callback) {
  major < 14 ? workerWrapper('stable', args, options, callback) : worker(args, options, callback);
}

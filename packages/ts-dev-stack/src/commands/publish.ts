import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import getopts from 'getopts-compat';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import { wrapWorker } from 'tsds-lib';
import validate from './validate';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const dist = path.join(__dirname, '..', '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'commands', 'publish.cjs'));

function worker(args, options, callback) {
  try {
    const np = resolveBin('np');

    const { _, ...npOptions } = getopts(args, { boolean: ['yolo', 'preview', 'yarn'], default: { yarn: false } });
    const npArgs = ['--no-release-draft'];
    if (npOptions.yolo) npArgs.push('--yolo');
    if (npOptions.preview) npArgs.push('--preview');
    if (!npOptions.yarn) npArgs.push('--no-yarn');

    const queue = new Queue(1);
    queue.defer(validate.bind(null, _, options));
    queue.defer(spawn.bind(null, np, npArgs, options));
    queue.await(callback);
  } catch (err) {
    console.log(err.message);
    return callback(err);
  }
}

export default function publish(args, options, callback) {
  major < 14 ? workerWrapper(version, args, options, callback) : worker(args, options, callback);
}

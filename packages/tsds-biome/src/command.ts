import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import moduleRoot from 'module-root-sync';
import { wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(moduleRoot(__dirname), 'dist', 'cjs', 'command.js'));

function worker(_args, options, callback) {
  spawn('npm', ['run', 'format'], options, callback);
}

export default function format(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

import path from 'path';
import url from 'url';
import { packageRoot, spawn, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'command.js'));

function worker(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  spawn('npm', ['run', 'format'], { cwd }, cb);
}

export default function format(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

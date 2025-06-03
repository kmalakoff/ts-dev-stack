import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import { type CommandOptions, type CommandCallback, wrapWorker } from 'tsds-lib';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.js'));

function worker(_args: string[], options: CommandOptions, callback: CommandCallback) {
  if (process.platform === 'win32' && ['x64', 'arm64'].indexOf(process.arch) < 0) return callback();
  spawn('npm', ['run', 'format'], options, callback);
}

export default function format(args, options, cb) {
  version !== 'local' ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

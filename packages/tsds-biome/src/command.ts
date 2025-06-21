import spawn from 'cross-spawn-cb';
import path from 'path';
import { type CommandCallback, type CommandOptions, wrapWorker } from 'tsds-lib';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.js'));

function worker(_args: string[], options: CommandOptions, callback: CommandCallback): undefined {
  if (process.platform === 'win32' && ['x64', 'arm64'].indexOf(process.arch) < 0) return callback();
  spawn('npm', ['run', 'format'], options, callback);
}

export default function format(args: string[], options: CommandOptions, callback: CommandCallback): undefined {
  version !== 'local' ? workerWrapper('stable', args, options, callback) : worker(args, options, callback);
}

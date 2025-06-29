import spawn from 'cross-spawn-cb';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { type CommandCallback, type CommandOptions, wrapWorker } from 'tsds-lib';
import url from 'url';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.js'));

function worker(_args: string[], options: CommandOptions, callback: CommandCallback) {
  const cwd: string = (options.cwd as string) || process.cwd();

  const queue = new Queue(1);
  queue.defer(rimraf2.bind(null, path.join(cwd as string, 'node_modules'), { disableGlob: true }));
  queue.defer(spawn.bind(null, 'npm', ['ci'], { ...options, cwd }));
  queue.defer(spawn.bind(null, 'npm', ['test'], { ...options, cwd }));
  queue.await(callback);
}

export default function pre(args: string[], options: CommandOptions, callback: CommandCallback) {
  major < 0 ? workerWrapper(version, args, options) : worker(args, options, callback);
}

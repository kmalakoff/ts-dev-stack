import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import Queue from 'queue-cb';
import { type CommandCallback, type CommandOptions, wrapWorker } from 'tsds-lib';
import type { CommandOptionsPublish } from './types.js';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.js'));

function worker(_args: string[], options_: CommandOptions, callback: CommandCallback) {
  const cwd = options_.cwd || process.cwd();
  const options = options_ as CommandOptionsPublish;
  options.package = JSON.parse(fs.readFileSync(path.join(cwd as string, 'package.json'), 'utf8'));

  const queue = new Queue(1);
  if ((options.package.scripts || {}).version) queue.defer(spawn.bind(null, 'npm', ['run', 'version'], { ...options, cwd }));
  queue.defer((cb) => spawn('git', ['add', '.'], options, cb.bind(null, null)));
  queue.defer((cb) => spawn('git', ['commit', '-m', `${options.package.version}`], options, cb.bind(null, null)));
  queue.await(callback);
}

export default function post(args: string[], options: CommandOptions, callback: CommandCallback) {
  major < 0 ? workerWrapper(version, args, options) : worker(args, options, callback);
}

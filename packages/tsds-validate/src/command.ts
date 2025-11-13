import spawn from 'cross-spawn-cb';
import path from 'path';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import format from 'tsds-biome';
import build from 'tsds-build';
import { type CommandCallback, type CommandOptions, wrapWorker } from 'tsds-lib';
import docs from 'tsds-typedoc';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.js'));

function worker(_args: string[], options: CommandOptions, callback: CommandCallback) {
  try {
    const depcheck = resolveBin('depcheck');
    const sortPackageJSON = resolveBin('sort-package-json');

    const queue = new Queue(1);
    queue.defer(format.bind(null, [], options));
    queue.defer(build.bind(null, [], options));
    queue.defer(spawn.bind(null, sortPackageJSON, [], options));
    queue.defer(spawn.bind(null, depcheck, [], options));
    queue.defer(docs.bind(null, [], options));
    queue.await(callback);
  } catch (err) {
    console.log(err.message);
    return callback(err);
  }
}

export default function publish(args: string[], options: CommandOptions, callback: CommandCallback) {
  version !== 'local' ? workerWrapper(version, args, options, callback) : worker(args, options, callback);
}

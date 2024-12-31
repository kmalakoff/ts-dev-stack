import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import moduleRoot from 'module-root-sync';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import format from 'tsds-biome';
import build from 'tsds-build';
import { wrapWorker } from 'tsds-lib';
import docs from 'tsds-typedoc';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const root = moduleRoot(__dirname);
const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const workerWrapper = wrapWorker(path.join(root, 'dist', 'cjs', 'commands', 'publish.cjs'));

// TODO: use np options
// const optionsNP = { alias: { 'no-publish': 'np', preview: 'p', yarn: 'y' } };
//   const npArgs = [];
//   if (options['no-publish']) npArgs.push('--no-publish');
//   if (options.preview) npArgs.push('--preview');
//   if (!options.yarn) npArgs.push('--no-yarn');

function worker(args, options, callback) {
  try {
    const depcheck = resolveBin('depcheck');
    const sortPackageJSON = resolveBin('sort-package-json');
    const np = resolveBin('np');

    const queue = new Queue(1);
    queue.defer(spawn.bind(null, depcheck, [], options));
    queue.defer(format.bind(null, args, options));
    queue.defer(build.bind(null, args, options));
    queue.defer(spawn.bind(null, sortPackageJSON, [], options));
    queue.defer(docs.bind(null, args, options));
    queue.defer(spawn.bind(null, np, ['--no-yarn'], options));
    queue.await(callback);
  } catch (err) {
    console.log(err.message);
    return callback(err);
  }
}

export default function publish(args, options, callback) {
  major < 14 ? workerWrapper(version, args, options, callback) : worker(args, options, callback);
}

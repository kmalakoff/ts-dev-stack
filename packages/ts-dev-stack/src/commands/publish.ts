import path from 'path';
import url from 'url';
import Queue from 'queue-cb';
import format from 'tsds-biome';
import build from 'tsds-build';
import { packageRoot, spawn, wrapWorker } from 'tsds-lib';
import docs from 'tsds-typedoc';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'commands', 'publish.js'));

// TODO: use np options
// const optionsNP = { alias: { 'no-publish': 'np', preview: 'p', yarn: 'y' } };
//   const npArgs = [];
//   if (options['no-publish']) npArgs.push('--no-publish');
//   if (options.preview) npArgs.push('--preview');
//   if (!options.yarn) npArgs.push('--no-yarn');

function worker(args, options, callback) {
  const cwd = options.cwd || process.cwd();

  const queue = new Queue(1);
  queue.defer(spawn.bind(null, 'depcheck', [], { cwd }));
  queue.defer(format.bind(null, args, options));
  queue.defer(build.bind(null, args, options));
  queue.defer(spawn.bind(null, 'sort-package-json', [], { cwd }));
  queue.defer(docs.bind(null, args, options));
  queue.defer(spawn.bind(null, 'np', ['--no-yarn'], {}));
  queue.await(callback);
}

export default function publish(args, options, callback) {
  major < 14 ? workerWrapper(version, args, options, callback) : worker(args, options, callback);
}

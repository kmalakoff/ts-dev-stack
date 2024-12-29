import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import moduleRoot from 'module-root-sync';
import { prependEnvPath } from 'module-which';
import Queue from 'queue-cb';
import format from 'tsds-biome';
import build from 'tsds-build';
import { wrapWorker } from 'tsds-lib';
import docs from 'tsds-typedoc';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = moduleRoot(__dirname);
const major = +process.versions.node.split('.')[0];
const version = major > 18 ? 'local' : 'stable';
const workerWrapper = wrapWorker(path.join(root, 'dist', 'cjs', 'commands', 'publish.js'));

// TODO: use np options
// const optionsNP = { alias: { 'no-publish': 'np', preview: 'p', yarn: 'y' } };
//   const npArgs = [];
//   if (options['no-publish']) npArgs.push('--no-publish');
//   if (options.preview) npArgs.push('--preview');
//   if (!options.yarn) npArgs.push('--no-yarn');

function worker(args, options, callback) {
  const cwd = options.cwd || process.cwd();
  const { envPath, pathKey } = prependEnvPath({ root, ...options });
  const env = { ...(options.env || process.env), [pathKey]: envPath };

  const queue = new Queue(1);
  queue.defer(spawn.bind(null, 'depcheck', [], { cwd, env }));
  queue.defer(format.bind(null, args, options));
  queue.defer(build.bind(null, args, options));
  queue.defer(spawn.bind(null, 'sort-package-json', [], { cwd, env }));
  queue.defer(docs.bind(null, args, options));
  queue.defer(spawn.bind(null, '', ['--no-yarn'], { cwd, env }));
  queue.await(callback);
}

export default function publish(args, options, callback) {
  major < 14 ? workerWrapper(version, args, options, callback) : worker(args, options, callback);
}

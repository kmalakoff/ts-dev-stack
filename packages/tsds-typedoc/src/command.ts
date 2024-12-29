import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import mkdirp from 'mkdirp-classic';
import moduleRoot from 'module-root-sync';
import { prependEnvPath } from 'module-which';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { config, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = moduleRoot(__dirname);
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(moduleRoot(__dirname), 'dist', 'cjs', 'command.js'));

function worker(_args, options, callback) {
  const cwd = options.cwd || process.cwd();
  const { envPath, pathKey } = prependEnvPath({ root, ...options });
  const env = { ...(options.env || process.env), [pathKey]: envPath };
  const source = config(options).source;
  const dest = path.resolve(process.cwd(), 'docs');

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer(mkdirp.bind(null, dest));
  queue.defer(spawn.bind(null, 'typedoc', [source], { cwd, env }));
  queue.await(callback);
}

export default function docs(args, options, callback) {
  major < 14 ? workerWrapper('stable', args, options, callback) : worker(args, options, callback);
}

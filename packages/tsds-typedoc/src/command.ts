import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import mkdirp from 'mkdirp-classic';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import rimraf2 from 'rimraf2';
import { loadConfig, wrapWorker } from 'tsds-lib';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'command.cjs'));

function worker(args, options, callback) {
  const config = loadConfig(options);
  if (!config) {
    console.log('tsds: no config. Skipping');
    return callback();
  }
  if (!config.source) {
    console.log('tsds: config missing source. Skipping docs');
    return callback();
  }

  try {
    const typedoc = resolveBin('typedoc');
    const dest = path.join(process.cwd(), 'docs');

    const queue = new Queue(1);
    queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
    queue.defer(mkdirp.bind(null, dest));
    queue.defer(spawn.bind(null, typedoc, [config.source, ...args, '--excludeExternals', 'true'], options));
    queue.await(callback);
  } catch (err) {
    return callback(err);
  }
}

export default function docs(args, options, callback) {
  version !== 'local' ? workerWrapper('stable', args, options, callback) : worker(args, options, callback);
}

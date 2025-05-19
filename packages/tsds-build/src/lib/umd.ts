import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import { installSync } from 'install-optional';
import Queue from 'queue-cb';
import resolveBin from 'resolve-bin-sync';
import rimraf2 from 'rimraf2';
import { wrapWorker } from 'tsds-lib';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..', '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'lib', 'umd.js'));

function worker(_args, options, callback) {
  const cwd = options.cwd || process.cwd();
  const dest = path.join(cwd, 'dist', 'umd');
  const configRoot = path.join(dist, 'esm', 'rollup');

  try {
    installSync('rollup', `${process.platform}-${process.arch}`, { cwd });
    const rollup = resolveBin('rollup');

    const queue = new Queue(1);
    queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
    queue.defer(spawn.bind(null, rollup, ['--config', path.join(configRoot, 'config.js')], options));
    queue.defer(spawn.bind(null, rollup, ['--config', path.join(configRoot, 'config.min.js')], options));
    queue.await(callback);
  } catch (err) {
    return callback(err);
  }
}

export default function umd(args, options, cb) {
  version !== 'local' ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

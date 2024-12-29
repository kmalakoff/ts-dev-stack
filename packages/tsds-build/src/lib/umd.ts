import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import moduleRoot from 'module-root-sync';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(moduleRoot(__dirname), 'dist', 'cjs', 'build', 'umd.js'));

function worker(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const dest = path.join(cwd, 'dist', 'umd');
  const configRoot = path.join(moduleRoot(__dirname), 'dist', 'esm', 'rollup');

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer(spawn.bind(null, 'rollup', ['--config', path.join(configRoot, 'config.mjs')], options));
  queue.defer(spawn.bind(null, 'rollup', ['--config', path.join(configRoot, 'config.min.mjs')], options));
  queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
  queue.await(cb);
}

export default function umd(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

import fs from 'fs';
import path from 'path';
import url from 'url';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { config, packageRoot, spawn, wrapWorker } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const major = +process.versions.node.split('.')[0];
const workerWrapper = wrapWorker(path.join(packageRoot(__dirname), 'dist', 'cjs', 'build', 'umd.js'));
const configPath = path.join(packageRoot(__dirname), 'dist', 'esm', 'rollup.config.mjs');

function worker(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.resolve(cwd, config(options).source);
  const dest = path.join(cwd, 'dist', 'umd');
  const args = ['rollup', '--config', configPath, '--input', src];

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
  queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
  queue.await(cb);
}

export default function umd(args, options, cb) {
  major < 14 ? workerWrapper('stable', args, options, cb) : worker(args, options, cb);
}

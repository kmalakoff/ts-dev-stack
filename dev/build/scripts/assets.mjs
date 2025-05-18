#!/usr/bin/env node

import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';

import * as getTS from 'get-tsconfig-compat';
export const tsconfig = getTS.getTsconfig();
tsconfig.config.compilerOptions = { ...tsconfig.config.compilerOptions, target: 'ES5' };

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const dest = path.resolve(__dirname, '..', 'assets', 'build.cjs');

function build(cb) {
  const cwd = process.cwd();
  const config = path.resolve(__dirname, 'rollup.config.mjs');

  const queue = new Queue(1);
  queue.defer(rimraf2.bind(null, path.dirname(dest), { disableGlob: true }));
  queue.defer(spawn.bind(null, 'rolldown', ['--config', config], { cwd, stdio: 'inherit' }));
  queue.await(cb);
}

build((err) => {
  !err || console.log(err.message);
  process.exit(err ? 1 : 0);
});

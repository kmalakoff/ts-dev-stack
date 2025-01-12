#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import { transformSync } from 'ts-swc-transform';

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
  queue.defer(fs.writeFileSync.bind(null, dest, transformSync(fs.readFileSync(dest, 'utf8'), dest, tsconfig).code, 'utf8'));
  queue.await(cb);
}

build((err) => {
  !err || console.log(err.message);
  process.exit(err ? 1 : 0);
});

#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const dest = path.resolve(__dirname, '..', 'assets');

function build(cb) {
  const cwd = process.cwd();
  const config = path.resolve(__dirname, 'rollup.config.mjs');
  const args = ['rolldown', '--config', config];

  const queue = new Queue(1);
  queue.defer((cb) => rimraf2(dest, { disableGlob: true }, cb.bind(null, null)));
  queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
  queue.defer(fs.writeFile.bind(null, path.join(dest, 'package.json'), '{"type":"commonjs"}'));
  queue.await(cb);
}

build((err) => {
  !err || console.log(err.message);
  process.exit(err ? 1 : 0);
});

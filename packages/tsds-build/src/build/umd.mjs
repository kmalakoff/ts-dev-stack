import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
import requireResolve from 'resolve/sync';
import rimraf2 from 'rimraf2';
import { binPath, source, spawn } from 'tsds-lib';

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(requireResolve('node-version-use/package.json', { basedir: __dirname }), 'nvu');

function packageRoot(dir, packageName) {
  if (path.basename(dir) === packageName) return dir;
  const nextDir = path.dirname(dir);
  if (nextDir === dir) throw new Error(''.concat(packageName, ' not found'));
  return packageRoot(nextDir, packageName);
}
const config = path.resolve(packageRoot(__dirname, 'tsds-build'), 'dist', 'esm', 'rollup-swc', 'index.mjs');

export default function umd(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const src = path.resolve(cwd, source(options));

  options = { ...options };
  options.type = 'umd';
  options.sourceMaps = true;
  options.dest = path.join(cwd, 'dist', 'umd');
  rimraf2(options.dest, { disableGlob: true }, () => {
    const queue = new Queue(1);
    (() => {
      let args = ['rollup', '--config', config, '--input', src];
      if (major < 14) args = [nvu, 'stable'].concat(args);
      queue.defer(spawn.bind(null, args[0], args.slice(1), { cwd }));
    })();
    queue.defer(fs.writeFile.bind(null, path.join(options.dest, 'package.json'), '{"type":"commonjs"}'));
    queue.await(cb);
  });
}

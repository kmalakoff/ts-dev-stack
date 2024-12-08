import path from 'path';
import Queue from 'queue-cb';
import resolve from 'resolve';
import { binPath, installPath, link, optionsToArgs, spawn } from 'tsds-lib';

function packageRoot(dir, packageName) {
  if (path.basename(dir) === packageName) return dir;
  const nextDir = path.dirname(dir);
  if (nextDir === dir) throw new Error(`${packageName} not found`);
  return packageRoot(nextDir, packageName);
}

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(resolve.sync('node-version-use/package.json', { basedir: __dirname }), 'nvu');
const config = path.resolve(packageRoot(__dirname, 'tsds-web-test-runner'), 'assets', 'web-test-runner.config.cjs');
const wtr = binPath(resolve.sync('@web/test-runner/package.json', { basedir: __dirname }), 'web-test-runner');

export default function command(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  options = { ...options };
  options.cwd = undefined;

  link(installPath(options), (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      let args = [wtr];
      if (major < 14) args = [nvu, 'stable', ...args];
      Array.prototype.push.apply(args, optionsToArgs(options));
      if (!options.config) Array.prototype.push.apply(args, optionsToArgs({ config }));
      Array.prototype.push.apply(args, _args.length ? _args.slice(-1) : ['test/**/*.test.{ts,tsx,jsx,mjs}']);
      spawn(args[0], args.slice(1), { cwd }, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
}

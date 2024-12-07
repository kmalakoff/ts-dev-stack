import requireResolve from 'resolve/sync';
import { binPath, spawn } from 'tsds-lib';

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(requireResolve('node-version-use/package.json', { basedir: __dirname }), 'nvu');

export default function format(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  let args = ['npm', 'run', 'format'];
  if (major < 14) args = [nvu, 'stable'].concat(args);
  spawn(args[0], args.slice(1), { cwd }, cb);
}

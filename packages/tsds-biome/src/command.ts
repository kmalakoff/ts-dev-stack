import path from 'path';
import url from 'url';
import resolve from 'resolve';
import { binPath, spawn } from 'tsds-lib';

// @ts-ignore
import process from './lib/process.cjs';
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
const nvu = binPath(resolve.sync('node-version-use/package.json', { basedir: __dirname }), 'nvu');

export default function format(_args, options, cb) {
  const cwd = options.cwd || process.cwd();
  let args = ['npm', 'run', 'format'];
  if (major < 14) args = [nvu, 'stable', ...args];
  spawn(args[0], args.slice(1), { cwd }, cb);
}

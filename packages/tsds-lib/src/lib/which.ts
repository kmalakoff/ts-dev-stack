import path from 'path';
import url from 'url';
import envPathKey from 'env-path-key';
import prepend from 'path-string-prepend';
import which from 'which';
import packageRoot from './packageRoot.js';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = packageRoot(__dirname);

const isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
const NODES = ['node', 'node.exe', 'node.cmd'];

export default function whichCompat(command, options, callback) {
  const cwd = options.cwd || process.cwd();
  const env = options.env || process.env;
  const pathKey = envPathKey(env) || '';
  let envPath = env[pathKey] || '';
  envPath = prepend(envPath, path.resolve(cwd, 'node_modules', '.bin'));
  envPath = prepend(envPath, path.resolve(root, '..', '.bin'));

  if (NODES.indexOf(path.basename(command).toLowerCase()) >= 0) {
    if (env.NODE || env.npm_node_execpath) return callback(null, env.NODE || env.npm_node_execpath);
  }

  // look up the full path
  which(command, { path: envPath }, (err, found) => {
    if (err) return callback(err);
    if (isWindows && found.slice(-4).toLowerCase() === '.cmd') found = found.slice(0, -4);
    callback(null, found);
  });
}

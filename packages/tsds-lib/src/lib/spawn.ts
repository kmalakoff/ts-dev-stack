import path from 'path';
import url from 'url';
import crossSpawn from 'cross-spawn-cb';
import pathKey from 'env-path-key';
import prepend from 'path-string-prepend';

import packageRoot from './packageRoot.js';

// @ts-ignore
import process from './process.cjs';
const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = packageRoot(__dirname, 'tsds-lib');

export default function spawn(cmd, args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const PATH_KEY = pathKey(options);
  const env = { ...process.env, env: options.env || {} };
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(root, '..', '..', 'node_modules', '.bin'));
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(cwd, 'node_modules', '.bin'));
  crossSpawn(cmd, args, { stdio: 'inherit', cwd, env: env }, cb);
}

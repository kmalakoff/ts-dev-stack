import path from 'path';
import url from 'url';
import crossSpawn from 'cross-spawn-cb';
import envPathKey from 'env-path-key';
import moduleRoot from 'module-root-sync';
import prepend from 'path-string-prepend';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = moduleRoot(__dirname);

export default function spawn(cmd, args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const env = options.env || process.env;
  const pathKey = envPathKey(env) || '';
  let envPath = env[pathKey] || '';
  envPath = prepend(envPath, path.resolve(cwd, 'node_modules', '.bin'));
  envPath = prepend(envPath, path.resolve(root, '..', '.bin'));
  crossSpawn(cmd, args, { stdio: 'inherit', cwd, env: { ...env, [pathKey]: envPath } }, cb);
}

const path = require('path');
const crossSpawn = require('cross-spawn-cb');
const pathKey = require('env-path-key');
const prepend = require('path-string-prepend');

module.exports = function spawn(cmd, args, options, cb) {
  const cwd = options.cwd || process.cwd();
  const PATH_KEY = pathKey(options);
  const env = { ...process.env, env: options.env || {} };
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(__dirname, '..', '..', '..', '..', '..', 'node_modules', '.bin'));
  env[PATH_KEY] = prepend(env[PATH_KEY] || '', path.resolve(cwd, 'node_modules', '.bin'));
  crossSpawn(cmd, args, { stdio: 'inherit', cwd, env: env }, cb);
};

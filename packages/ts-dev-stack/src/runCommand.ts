import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import installModule from 'install-module-linked';
import moduleRoot from 'module-root-sync';
import { prependEnvPath } from 'module-which';
import resolve from 'resolve';
import { constants, config } from 'tsds-lib';

// @ts-ignore
import lazy from './lazy.cjs';
const _dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const root = moduleRoot(_dirname);

function run(specifier, args, options, cb) {
  try {
    const mod = lazy(specifier)();
    const fn = mod.default || mod;
    fn(args, options, cb);
  } catch (err) {
    return cb(err);
  }
}

export default function runCommand(name, args, options, cb) {
  const { commands } = config();

  const command = commands[name];
  if (!command) return cb(new Error(`Unrecognized command: ${name} ${args.join(' ')}`));

  const { _, ...opts } = getopts(args, { stopEarly: true, alias: { 'dry-run': 'dr' }, boolean: ['dry-run'] });
  if (opts['dry-run']) return cb();

  const cwd = options.cwd || process.cwd();
  const { envPath, pathKey } = prependEnvPath({ root, ...options });
  const env = { ...(options.env || process.env), [pathKey]: envPath };
  const runOptions = { ...options, cwd, env, stdio: 'inherit' };
  if (constants.moduleRegEx.test(command)) {
    try {
      resolve.sync(path.join(command, 'package.json'));
      return run(command, args, runOptions, cb);
    } catch (_err) {
      return installModule(command, path.join(root, 'node_modules'), (err) => {
        console.log(`Module missing: ${command}. ${err ? `Failed install: ${err.message}` : 'Installed'}`);
        err ? cb(err) : run(command, args, runOptions, cb);
      });
    }
  }
  // for relative files, ensure the extension matches
  return run(path.resolve(root, 'dist', 'cjs', command), args, runOptions, cb);
}

import Module from 'module';
import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import installModule from 'install-module-linked';
import resolve from 'resolve';
import { constants, config } from 'tsds-lib';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const _dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(_dirname, '..');
const nodeModules = path.join(_dirname, '..', '..', 'node_modules');

function run(specifier, args, options, cb) {
  try {
    const mod = _require(specifier);
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
  const runOptions = { ...options, cwd, stdio: 'inherit' };
  if (constants.moduleRegEx.test(command)) {
    try {
      resolve.sync(path.join(command, 'package.json'));
      return run(command, args, runOptions, cb);
    } catch (_err) {
      return installModule(command, nodeModules, (err) => {
        console.log(`Module missing: ${command}. ${err ? `Failed install: ${err.message}` : 'Installed'}`);
        err ? cb(err) : run(command, args, runOptions, cb);
      });
    }
  }
  // for relative files, ensure the extension matches
  return run(path.join(dist, 'cjs', command), args, runOptions, cb);
}

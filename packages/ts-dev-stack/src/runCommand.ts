import Module from 'module';
import path from 'path';
import url from 'url';
import getopts from 'getopts-compat';
import installModule from 'install-module-linked';
import resolve from 'resolve';
import { loadConfig,  type CommandOptions, type CommandCallback  } from 'tsds-lib';
import * as constants from './constants.js';

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const _dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(_dirname, '..');
const nodeModules = path.join(_dirname, '..', '..', 'node_modules');
const moduleRegEx = /^[^.\/]|^\.[^.\/]|^\.\.[^\/]/;

function run(specifier, args: string[], options: CommandOptions, callback: CommandCallback) {
  try {
    const mod = _require(specifier);
    const fn = mod.default || mod;
    fn(args, options, callback);
  } catch (err) {
    return callback(err);
  }
}

export default function runCommand(name, args: string[], options: CommandOptions, callback: CommandCallback) {
  const config = loadConfig(options);
  const commands = {
    ...constants.commands,
    ...((config || {}).commands || {}),
  };
  const command = commands[name];
  if (!command) return callback(new Error(`Unrecognized command: ${name} ${args.join(' ')}`));
  const { _, ...opts } = getopts(args, { stopEarly: true, alias: { 'dry-run': 'dr' }, boolean: ['dry-run'] });
  if (opts['dry-run']) return callback();
  const cwd = options.cwd || process.cwd();
  const runOptions = { ...options, cwd, stdio: 'inherit' };
  if (moduleRegEx.test(command)) {
    try {
      resolve.sync(path.join(command, 'package.json'));
      return run(command, args, runOptions, callback);
    } catch (_err) {
      return installModule(command, nodeModules, (err) => {
        console.log(`Module missing: ${command}. ${err ? `Failed install: ${err.message}` : 'Installed'}`);
        err ? callback(err) : run(command, args, runOptions, callback);
      });
    }
  }
  // for relative files, ensure the extension matches
  return run(path.join(dist, 'cjs', command), args, runOptions, callback);
}

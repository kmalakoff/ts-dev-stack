import getopts from 'getopts-compat';
import installModule from 'install-module-linked';
import Module from 'module';
import path from 'path';
import * as resolve from 'resolve';
import { type CommandCallback, type CommandOptions, loadConfig } from 'tsds-lib';
import url from 'url';
import * as constants from './constants.ts';

const resolveSync = (resolve.default ?? resolve).sync;

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const _dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const nodeModules = path.join(_dirname, '..', '..', 'node_modules');

function run(specifier: string, args: string[], options: CommandOptions, callback: CommandCallback): undefined {
  try {
    const mod = _require(specifier);
    const fn = mod.default || mod;
    fn(args, options, callback);
  } catch (err) {
    return callback(err);
  }
}

export default function runCommand(name: string, args: string[], options: CommandOptions, callback: CommandCallback): undefined {
  const config = loadConfig(options);
  const configCommands = (config || {}).commands || {};
  const commands = {
    ...constants.commands,
    ...configCommands,
  };
  const command = commands[name];
  // Check if command is explicitly disabled (null) vs not found
  if (command === null) return callback(new Error(`Command disabled: ${name}`));
  if (!command) return callback(new Error(`Unrecognized command: ${name} ${args.join(' ')}`));
  const { _, ...opts } = getopts(args, { stopEarly: true, alias: { 'dry-run': 'dr' }, boolean: ['dry-run'] });
  if (opts['dry-run']) return callback();
  const cwd: string = (options.cwd as string) || process.cwd();
  const runOptions = { ...options, cwd, stdio: 'inherit' } as CommandOptions;
  try {
    resolveSync(path.join(command, 'package.json'), { basedir: _dirname }); // pass basedir because internally resolveSync doesn't properly handle file://basedir on esm
    return run(command, args, runOptions, callback);
  } catch (_err) {
    installModule(command, nodeModules, (err) => {
      console.log(`Module missing: ${command}. ${err ? `Failed install: ${err.message}` : 'Installed'}`);
      err ? callback(err) : run(command, args, runOptions, callback);
    });
  }
}

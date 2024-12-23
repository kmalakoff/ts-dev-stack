import path from 'path';
import url from 'url';
import installModule from 'install-module-linked';
import resolve from 'resolve';
import { constants, config } from 'tsds-lib';

// @ts-ignore
import lazy from './lazy.cjs';
const ext = path.extname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

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

  if (constants.moduleRegEx.test(command)) {
    try {
      resolve.sync(path.join(command, 'package.json'));
      return run(command, args, options, cb);
    } catch (_err) {
      const nodeModules = path.dirname(path.dirname(resolve.sync(path.join('tsds-lib', 'package.json'))));
      return installModule(command, nodeModules, (err) => {
        console.log(`Module missing: ${command}. ${err ? `Failed install: ${err.message}` : 'Installed'}`);
        err ? cb(err) : run(command, args, options, cb);
      });
    }
  }
  // for relative files, ensure the extension matches
  return run(command.replace(/\.[^/.]+$/, ext), args, options, cb);
}

import path from 'path';
import url from 'url';
import { constants, config } from 'tsds-lib';

// @ts-ignore
import lazy from './lazy.cjs';
const ext = path.extname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

export default function runCommand(name, args, options, cb) {
  const { commands } = config();

  const command = commands[name];
  if (!command) return cb(new Error(`Unrecognized command: ${name} ${args.join(' ')}`));

  try {
    // for relative files, ensure the extension matches
    const specifier = constants.moduleRegEx.test(command) ? command : command.replace(/\.[^/.]+$/, ext);
    const mod = lazy(specifier)();
    const fn = mod.default || mod;
    fn(args, options, cb);
  } catch (err) {
    return cb(err);
  }
}

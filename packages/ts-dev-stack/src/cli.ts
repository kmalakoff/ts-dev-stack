import fs from 'fs';
import path from 'path';
import url from 'url';
import exit from 'exit';
import getopts from 'getopts-compat';
import runCommand from './runCommand.js';

const _dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

export default function cli(argv, name) {
  if (argv.length === 0) {
    console.log(`Command missing ${name} ${argv.join(',')}`);
    return exit(-1);
  }

  const { _, ...opts } = getopts(argv, { stopEarly: true, alias: { version: 'v' }, boolean: ['version'] });
  if (opts.version) {
    const pkg = JSON.parse(fs.readFileSync(path.join(_dirname, '..', '..', 'package.json'), 'utf8'));
    console.log(pkg.version);
    return exit(0);
  }

  runCommand(argv[0], argv.slice(1), {}, (err) => {
    if (err && err.message.indexOf('ExperimentalWarning') < 0) {
      console.log(err.message);
      return exit(-1);
    }
    exit(0);
  });
}

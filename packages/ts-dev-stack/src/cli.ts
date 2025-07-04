import exit from 'exit';
import fs from 'fs';
import getopts from 'getopts-compat';
import path from 'path';
import url from 'url';
import runCommand from './runCommand.ts';

const _dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);

const ERROR_CODE = 15;

export default function cli(argv: string[], name: string): undefined {
  if (argv.length === 0) {
    console.log(`Command missing ${name} ${argv.join(',')}`);
    return exit(ERROR_CODE);
  }

  const { _, ...opts } = getopts(argv, { stopEarly: true, alias: { version: 'v' }, boolean: ['version'] });
  if (opts.version) {
    const pkg = JSON.parse(fs.readFileSync(path.join(_dirname, '..', '..', 'package.json'), 'utf8'));
    console.log(pkg.version);
    return exit(0);
  }
  runCommand(argv[0], argv.slice(1), {}, (err) => {
    if (err && err.message.indexOf('ExperimentalWarning') >= 0) err = null;
    if (err) console.log(err.message);
    exit(err ? ERROR_CODE : 0);
  });
}

import exit from 'exit-compat';
import fs from 'fs';
import getopts from 'getopts-compat';
import path from 'path';
import url from 'url';
import * as constants from './constants.ts';
import runCommand from './runCommand.ts';

const _dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);

const ERROR_CODE = 15;

function printHelp(name: string): void {
  console.log(`Usage: ${name} <command> [options]`);
  console.log('');
  console.log('Commands:');
  for (const command of Object.keys(constants.commands).sort()) console.log(`  ${command}`);
  console.log('');
  console.log('Options:');
  console.log('  -h, --help     Show this help message');
  console.log('  -v, --version  Show version number');
}

export default function cli(argv: string[], name: string): void {
  const { _, ...opts } = getopts(argv, { stopEarly: true, alias: { version: 'v', help: 'h' }, boolean: ['version', 'help'] });
  if (opts.version) {
    const pkg = JSON.parse(fs.readFileSync(path.join(_dirname, '..', '..', 'package.json'), 'utf8'));
    console.log(pkg.version);
    exit(0);
    return;
  }
  if (opts.help) {
    printHelp(name);
    exit(0);
    return;
  }
  if (argv.length === 0) {
    console.log(`Command missing ${name} ${argv.join(',')}`);
    exit(ERROR_CODE);
    return;
  }
  runCommand(argv[0], argv.slice(1), {}, (err) => {
    if (err && err.message.indexOf('ExperimentalWarning') >= 0) err = undefined;
    if (err) console.log(err.message);
    exit(err ? ERROR_CODE : 0);
  });
}

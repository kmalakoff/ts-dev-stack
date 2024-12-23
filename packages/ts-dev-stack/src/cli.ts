import exit from 'exit';
import getopts from 'getopts-compat';
import runCommand from './runCommand.js';

export default function cli(argv, name) {
  if (argv.length === 0) {
    console.log(`Command missing ${name} ${argv.join(',')}`);
    return exit(-1);
  }

  const options = getopts(argv.slice(1), { stopEarly: true });
  const args = argv.slice(0, 1).concat(options._);
  runCommand(argv[0], args.slice(1), options, (err) => {
    if (err && err.message.indexOf('ExperimentalWarning') < 0) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    exit(0);
  });
}

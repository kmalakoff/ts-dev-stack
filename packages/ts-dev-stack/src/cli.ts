import exit from 'exit';
import runCommand from './runCommand.js';

export default function cli(argv, name) {
  if (argv.length === 0) {
    console.log(`Command missing ${name} ${argv.join(',')}`);
    return exit(-1);
  }

  runCommand(argv[0], argv.slice(1), {}, (err) => {
    if (err && err.message.indexOf('ExperimentalWarning') < 0) {
      console.log(err.message);
      return exit(-1);
    }
    exit(0);
  });
}

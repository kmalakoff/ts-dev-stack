import exit from 'exit';
import getopts from 'getopts-compat';
import command from './index.js';

const optionsCLI = {
  alias: { config: 'c' },
};

export default function cli(argv, _name) {
  const options = getopts(argv.slice(1), { stopEarly: true, ...optionsCLI });
  const args = argv.slice(0, 1).concat(options._);
  command(args.slice(1), options, (err) => {
    if (err && err.message.indexOf('ExperimentalWarning') < 0) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    exit(0);
  });
}

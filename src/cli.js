const getopts = require('getopts-compat');
const exit = require('exit');
const commands = require('./index.mjs');
commands['test:node'] = commands.testNode;
commands['test:browser'] = commands.testBrowser;

module.exports = function cli(argv, name) {
  if (argv.length === 0) {
    console.log(`Command missing${name} ${argv.join(',')}`);
    return exit(-1);
  }

  const command = commands[argv[0]];
  if (!command) {
    console.log(`Unrecognized command: ${argv.join(' ')}`);
    return exit(-1);
  }

  const options = getopts(argv.slice(1), { stopEarly: true, ...(command.options || {}) });
  const args = argv.slice(0, 1).concat(options._);
  command(args.slice(1), options, (err) => {
    if (err && err.message.indexOf('ExperimentalWarning') < 0) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    exit(0);
  });
};

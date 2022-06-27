/* eslint-disable @typescript-eslint/no-var-requires */
var getopts = require('getopts-compat');
var exit = require('exit');
var assign = require('just-extend');

var commands = [
  { name: 'build', path: './build' },
  { name: 'build:dist', path: './build/js' },
  { name: 'build:docs', path: './build/docs' },
  { name: 'coverage:node', path: './quality/c8' },
  { name: 'deploy', path: './deploy' },
  { name: 'format', path: './quality/format' },
  { name: 'lint', path: './quality/lint' },
  { name: 'link', path: './link' },
  { name: 'test', path: './test' },
  { name: 'test:engines', path: './test/engines' },
  { name: 'test:node', path: './test/mocha' },
  { name: 'test:browser', path: './test/karma' },
  { name: 'version', path: './deploy/version' },
];

function runCommand(argv, command) {
  const fn = require(command.path);
  var options = getopts(
    argv.slice(1),
    assign(
      {
        stopEarly: true,
      },
      fn.options || {}
    )
  );
  var args = argv.slice(0, 1).concat(options._);
  fn(args.slice(1), options, function (err) {
    if (err) {
      console.log(err.message);
      return exit(err.code || -1);
    }
    exit(0);
  });
}

module.exports = function cli(argv, name) {
  if (argv.length === 0) {
    console.log('Command missing ' + name + ' ' + argv.join(','));
    return exit(-1);
  }

  for (var index = 0; index < commands.length; index++) {
    if (commands[index].name !== argv[0]) continue;
    return runCommand(argv, commands[index]);
  }
  console.log('Unrecognized command: ' + argv.join(' '));
  exit(-1);
};

const Queue = require('queue-cb');

const { link, installPath, spawn, optionsToArgs } = require('tsds-lib');

const major = +process.versions.node.split('.')[0];
const mochaName = major < 12 ? 'mocha-compat' : 'mocha';

let binMocha = null;
module.exports = function command(_args, options, cb) {
  if (!binMocha) binMocha = require.resolve(`${mochaName}/bin/_${mochaName}`);
  const cwd = options.cwd || process.cwd();

  link(installPath(options), (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      let args = [binMocha, '--watch-extensions', 'ts,tsx'];
      args = args.concat(optionsToArgs(options));
      args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
      spawn('ts-swc', args, { cwd }, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
};

module.exports.options = { alias: { temp: 't' } };

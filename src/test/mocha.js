const _path = require('path');
const Queue = require('queue-cb');
const spawnArgs = require('ts-swc-loaders/lib/spawnArgs.js');

const link = require('../link');
const spawn = require('../lib/spawn');

const major = +process.versions.node.split('.')[0];
const type = major >= 12 ? 'module' : 'commonjs';

module.exports = function mocha(args, options, cb) {
  link(args, options, (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      const tests = args && args.length ? args[0] : 'test/**/*.test.*';
      const mochaOptions = options.timeout ? ['--timeout', options.timeout] : [];
      const mocha = major >= 12 ? 'mocha' : 'mocha-compat';
      const cmd = require.resolve(`${mocha}/bin/_${mocha}`);
      const argsSpawn = spawnArgs(type, cmd, mochaOptions.concat(['--watch-extensions', 'ts,tsx', tests]), {});
      spawn(argsSpawn[0], argsSpawn[1], argsSpawn[2], cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
};

module.exports.options = { alias: { temp: 't' } };

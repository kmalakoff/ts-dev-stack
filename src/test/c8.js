const path = require('path');
const rimraf = require('rimraf');
const Queue = require('queue-cb');
const { spawnParams } = require('ts-swc-loaders');

const link = require('../link');
const spawn = require('../lib/spawn');

const major = +process.versions.node.split('.')[0];
const type = major < 12 ? 'commonjs' : 'module';

module.exports = function c8(_args, options, cb) {
  const cwd = options.cwd || process.cwd();

  link(_args, options, (err, restore) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer((cb) => {
      rimraf(path.resolve(process.cwd(), 'coverage'), () => {
        cb();
      });
    });
    queue.defer((cb) => {
      const cmd = require.resolve('c8/bin/c8');
      let args = ['--config', path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json'), 'mocha', '--watch-extensions', 'ts,tsx'];
      args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
      const params = spawnParams(type, { cwd });
      if (params.options.NODE_OPTIONS || params.args[0] === '--require') {
        spawn(cmd, params.args.concat(args), params.options, cb);
      } else {
        spawn('node', params.args.concat([cmd]).concat(args), params.options, cb);
      }
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
};

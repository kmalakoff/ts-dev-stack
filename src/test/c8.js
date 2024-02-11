const path = require('path');
const rimraf = require('rimraf');
const Queue = require('queue-cb');

const link = require('../link');
const spawn = require('../lib/spawn');

module.exports = function c8(_args, _options, cb) {
  link(_args, _options, (err, restore) => {
    if (err) return cb(err);

    const queue = new Queue(1);
    queue.defer((cb) => {
      rimraf(path.resolve(process.cwd(), 'coverage'), () => {
        cb();
      });
    });
    queue.defer((cb) => {
      let args = ['--config', path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json')];
      args.push('mocha');
      args = args.concat(_args.length ? _args.slice(-1) : ['test/unit/*.test.*']);
      spawn('c8', args, { env: { NODE_OPTIONS: '--loader ts-swc-loaders' } }, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
};

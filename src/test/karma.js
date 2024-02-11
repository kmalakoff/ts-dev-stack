const path = require('path');
const Queue = require('queue-cb');
const link = require('../link');
const spawn = require('../lib/spawn');

module.exports = function karma(args, options, cb) {
  link(args, options, (_err, restore) => {
    const queue = new Queue(1);
    queue.defer((cb) => {
      const tests = args.length ? args[0] : 'test/**/*.test.*';
      spawn('karma', ['start', path.join(__dirname, '..', '..', '..', 'assets', 'karma.conf.cjs'), tests], {}, cb);
    });
    queue.await((err) => {
      restore((err2) => {
        cb(err || err2);
      });
    });
  });
};

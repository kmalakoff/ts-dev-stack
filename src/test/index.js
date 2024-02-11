const Queue = require('queue-cb');
const mocha = require('./mocha');
const karma = require('./karma');
const c8 = require('./c8');

module.exports = function test(args, options, cb) {
  const queue = new Queue(1);
  queue.defer(mocha.bind(null, args, options));
  queue.defer(karma.bind(null, args, options));
  queue.defer(c8.bind(null, args, options));
  queue.await(cb);
};

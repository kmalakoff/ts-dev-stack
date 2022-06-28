var Queue = require('queue-cb');
var mocha = require('./mocha');
var karma = require('./karma');
var c8 = require('../quality/c8');

module.exports = function test(args, options, cb) {
  var queue = new Queue(1);
  queue.defer(mocha.bind(null, args, options));
  queue.defer(karma.bind(null, args, options));
  queue.defer(c8.bind(null, args, options));
  queue.await(cb);
};

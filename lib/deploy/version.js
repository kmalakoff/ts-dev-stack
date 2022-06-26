/* eslint-disable @typescript-eslint/no-var-requires */
var Queue = require('queue-cb');
var spawn = require('../lib/spawn');

var docs = require('../build/docs');

module.exports = function version(_args, _options, cb) {
  var queue = new Queue(1);
  queue.defer(docs.bind(null, _args, _options));
  queue.defer(spawn.bind(null, 'git', ['add', 'docs'], {}));
  queue.await(cb);
};

var Queue = require('queue-cb');
var lint = require('../quality/lint');
var js = require('./js');
var docs = require('./docs');

module.exports = function deploy(args, options, cb) {
  var queue = new Queue(1);
  queue.defer(lint.bind(null, args, options));
  queue.defer(js.bind(null, args, options));
  queue.defer(docs.bind(null, args, options));
  queue.await(cb);
};

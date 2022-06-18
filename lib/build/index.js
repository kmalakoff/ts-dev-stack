/* eslint-disable @typescript-eslint/no-var-requires */
var Queue = require("queue-cb");
var dist = require("./dist");
var docs = require("./docs");

module.exports = function deploy(args, options, cb) {
  console.log(1)
  var queue = new Queue(1);
  queue.defer(dist.bind(null, args, options));
  queue.defer(docs.bind(null, args, options));
  queue.await(cb);
};

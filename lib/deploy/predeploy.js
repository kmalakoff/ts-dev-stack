/* eslint-disable @typescript-eslint/no-var-requires */
var Queue = require("queue-cb");
var spawn = require("../lib/spawn");

var dist = require("../build/dist");
var docs = require("../build/docs");
var format = require("../quality/format");
var lint = require("../quality/lint");

module.exports = function predeploy(_args, _options, cb) {
  var queue = new Queue(1);
  queue.defer(lint.bind(null, _args, _options));
  queue.defer(format.bind(null, _args, _options));
  queue.defer(dist.bind(null, _args, _options));
  queue.defer(spawn.bind(null, "git", ["add", "dist"], {}));
  queue.defer(docs.bind(null, _args, _options));
  queue.defer(spawn.bind(null, "git", ["add", "docs"], {}));
  queue.defer(spawn.bind(null, "sortpack", [], {}));
  queue.defer(spawn.bind(null, "depcheck", [], {}));
  queue.await(cb);
};

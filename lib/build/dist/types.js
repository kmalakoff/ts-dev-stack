/* eslint-disable @typescript-eslint/no-var-requires */
var Queue = require("queue-cb");
var spawn = require("../../lib/spawn");

module.exports = function types(_args, _options, cb) {
  var queue = new Queue(1);
  queue.defer(spawn.bind(null, "tsc", ["--declaration", "--emitDeclarationOnly", "--outDir", "dist/esm"], {}));
  queue.defer(spawn.bind(null, "tsc", ["--declaration", "--emitDeclarationOnly", "--outDir", "dist/cjs"], {}));
  queue.await(cb);
};

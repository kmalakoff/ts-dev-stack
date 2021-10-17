/* eslint-disable @typescript-eslint/no-var-requires */
var Queue = require("queue-cb");
var spawn = require("../lib/spawn");
var predeploy = require("./predeploy");
var postdeploy = require("./postdeploy");

module.exports = function deploy(args, options, cb) {
  var queue = new Queue(1);
  queue.defer(predeploy.bind(null, args, options));
  queue.defer(spawn.bind(null, "np", ["--no-yarn"], {}));
  queue.defer(postdeploy.bind(null, args, options));
  queue.await(cb);
};

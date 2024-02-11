"use strict";
var Queue = require("queue-cb");
var spawn = require("../lib/spawn");
var predeploy = require("./predeploy");
var postdeploy = require("./postdeploy");
module.exports = function deploy(args, options, cb) {
    var npArgs = [];
    if (options["no-publish"]) npArgs.push("--no-publish");
    if (options.preview) npArgs.push("--preview");
    if (!options.yarn) npArgs.push("--no-yarn");
    var queue = new Queue(1);
    queue.defer(predeploy.bind(null, args, options));
    queue.defer(spawn.bind(null, "np", npArgs, {}));
    queue.defer(postdeploy.bind(null, args, options));
    queue.await(cb);
};
module.exports.options = {
    alias: {
        "no-publish": "np",
        preview: "p",
        yarn: "y"
    }
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}
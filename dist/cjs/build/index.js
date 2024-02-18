"use strict";
var Queue = require("queue-cb");
var cjs = require("./cjs");
var esm = require("./esm");
var umd = require("./umd");
var types = require("./types");
var targets = require("../lib/targets");
module.exports = function build(args, options, cb) {
    var targs = targets(options);
    var queue = new Queue(1);
    targs.indexOf("cjs") < 0 || queue.defer(cjs.bind(null, args, options));
    targs.indexOf("esm") < 0 || queue.defer(esm.bind(null, args, options));
    targs.indexOf("umd") < 0 || queue.defer(umd.bind(null, args, options));
    queue.defer(types.bind(null, args, options));
    queue.await(cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { module.exports = exports.default; for (var key in exports) module.exports[key] = exports[key]; }
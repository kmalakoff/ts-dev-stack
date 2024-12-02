"use strict";
var Queue = require('queue-cb');
var mocha = require('./mocha');
var karma = require('./karma');
// const c8 = require('./c8');
module.exports = function test(args, options, cb) {
    var queue = new Queue(1);
    queue.defer(mocha.bind(null, args, options));
    queue.defer(karma.bind(null, args, options));
    // queue.defer(c8.bind(null, args, options));
    queue.await(cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; }; module.exports = exports.default; } catch (_) {} }
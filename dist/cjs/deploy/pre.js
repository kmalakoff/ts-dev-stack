"use strict";
var Queue = require('queue-cb');
var spawn = require('../lib/spawn');
var build = require('../build');
var format = require('../quality/format');
module.exports = function predeploy(args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var queue = new Queue(1);
    queue.defer(format.bind(null, args, options));
    queue.defer(build.bind(null, args, options));
    queue.defer(spawn.bind(null, 'sort-package-json', [], {
        cwd: cwd
    }));
    queue.defer(spawn.bind(null, 'depcheck', [], {
        cwd: cwd
    }));
    queue.await(cb);
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; }; module.exports = exports.default; } catch (_) {} }
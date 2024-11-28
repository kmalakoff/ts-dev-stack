"use strict";
var path = require('path');
var _fs = require('fs');
var mkdirp = require('mkdirp');
var Queue = require('queue-cb');
var rimraf = require('../lib/rimraf');
var spawn = require('../lib/spawn');
var source = require('../lib/source');
module.exports = function docs(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = source(options);
    var dest = path.resolve(process.cwd(), 'docs');
    rimraf(dest, function() {
        var queue = new Queue(1);
        queue.defer(mkdirp.bind(null, dest));
        queue.defer(spawn.bind(null, 'typedoc', [
            src
        ], {
            cwd: cwd
        }));
        queue.await(cb);
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }
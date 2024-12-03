"use strict";
var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');
module.exports = function unlink(target, cb) {
    var movedPath = path.join(path.dirname(target), "".concat(path.basename(target), ".tsds"));
    var queue = new Queue(1);
    queue.defer(fs.unlink.bind(null, target));
    queue.defer(fs.rename.bind(null, movedPath, target));
    queue.await(function() {
        cb();
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
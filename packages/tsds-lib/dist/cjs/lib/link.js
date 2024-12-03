"use strict";
var path = require('path');
var fs = require('fs');
var Queue = require('queue-cb');
var mkdirp = require('mkdirp');
var unlink = require('./unlink');
var isWindows = process.platform === 'win32' || /^(msys|cygwin)$/.test(process.env.OSTYPE);
var symlinkType = isWindows ? 'junction' : 'dir';
function saveLink(target, cb) {
    var movedPath = path.join(path.dirname(target), "".concat(path.basename(target), ".tsds"));
    var queue = new Queue(1);
    queue.defer(fs.rename.bind(null, target, movedPath));
    queue.defer(createLink.bind(null, target));
    queue.await(cb);
}
function createLink(target, cb) {
    var queue = new Queue(1);
    queue.defer(function(cb) {
        mkdirp(path.dirname(target), function() {
            cb();
        });
    });
    queue.defer(fs.symlink.bind(null, process.cwd(), target, symlinkType));
    queue.await(cb);
}
function removeLink(target, cb) {
    fs.unlink(target, cb);
}
module.exports = function link(target, cb) {
    try {
        fs.lstat(target, function(_, lstat) {
            // new
            if (!lstat) {
                createLink(target, function(err) {
                    err ? cb(err) : cb(null, removeLink.bind(null, target));
                });
            } else if (lstat.isDirectory()) {
                saveLink(target, function(err) {
                    err ? cb(err) : cb(null, unlink.bind(null, target));
                });
            } else {
                removeLink(target, function() {
                    createLink(target, function(err) {
                        err ? cb(err) : cb(null, removeLink.bind(null, target));
                    });
                });
            }
        });
    } catch (err) {
        return cb(err);
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
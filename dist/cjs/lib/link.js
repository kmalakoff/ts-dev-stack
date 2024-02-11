"use strict";
var path = require("path");
var fs = require("fs");
var Queue = require("queue-cb");
var mkdirp = require("mkdirp");
var unlink = require("./unlink");
function saveLink(installPath, cb) {
    var movedPath = path.join(path.dirname(installPath), path.basename(installPath) + ".tsds");
    var queue = new Queue(1);
    queue.defer(fs.rename.bind(null, installPath, movedPath));
    queue.defer(createLink.bind(null, installPath));
    queue.await(cb);
}
function createLink(installPath, cb) {
    var queue = new Queue(1);
    queue.defer(function(cb) {
        mkdirp(path.dirname(installPath), function() {
            cb();
        });
    });
    queue.defer(fs.symlink.bind(null, process.cwd(), installPath, "dir"));
    queue.await(cb);
}
function removeLink(installPath, cb) {
    fs.unlink(installPath, cb);
}
module.exports = function link(installPath, cb) {
    try {
        fs.lstat(installPath, function(_, lstat) {
            // new
            if (!lstat) {
                createLink(installPath, function(err) {
                    err ? cb(err) : cb(null, removeLink.bind(null, installPath));
                });
            } else if (lstat.isDirectory()) {
                saveLink(installPath, function(err) {
                    err ? cb(err) : cb(null, unlink.bind(null, installPath));
                });
            } else {
                removeLink(installPath, function() {
                    createLink(installPath, function(err) {
                        err ? cb(err) : cb(null, removeLink.bind(null, installPath));
                    });
                });
            }
        });
    } catch (err) {
        return cb(err);
    }
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}
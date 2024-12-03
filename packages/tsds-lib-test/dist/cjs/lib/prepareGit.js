"use strict";
var path = require('path');
var Queue = require('queue-cb');
var spawn = require('cross-spawn-cb');
var access = require('fs-access-compat');
var rimraf2 = require('rimraf2');
var tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
var mkdirp = require('mkdirp');
var shortHash = require('short-hash');
module.exports = function prepareGit(git, options, callback) {
    var cwd = options.cwd || process.cwd();
    var pkg = require(path.join(cwd, 'package.json'));
    var dest = path.join(tmpdir(), pkg.name, shortHash(cwd));
    var targetName = path.basename(git, path.extname(git));
    var targetPath = path.join(dest, targetName);
    mkdirp.sync(dest);
    access(targetPath, function(err) {
        if (!err && options.clean) {
            rimraf2.sync(targetPath, {
                disableGlob: true
            });
            err = true;
        }
        var queue = new Queue(1);
        // does not exist - clone
        if (err) {
            queue.defer(spawn.bind(null, 'git', [
                'clone',
                git
            ], {
                stdio: 'inherit',
                cwd: dest
            }));
        } else {
            queue.defer(spawn.bind(null, 'git', [
                'clean',
                '-fd'
            ], {
                stdio: 'inherit',
                cwd: targetPath
            }));
            queue.defer(spawn.bind(null, 'git', [
                'reset',
                '--hard',
                'HEAD'
            ], {
                stdio: 'inherit',
                cwd: targetPath
            }));
            queue.defer(spawn.bind(null, 'git', [
                'pull',
                '--rebase'
            ], {
                stdio: 'inherit',
                cwd: targetPath
            }));
        }
        queue.await(callback);
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
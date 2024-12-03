"use strict";
var fs = require('fs');
var path = require('path');
var Queue = require('queue-cb');
var spawn = require('cross-spawn-cb');
var access = require('fs-access-compat');
var tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
var mkdirp = require('mkdirp');
var rimraf2 = require('rimraf2');
var shortHash = require('short-hash');
var dest = path.join(tmpdir(), 'tsds', shortHash(__dirname));
mkdirp.sync(dest);
module.exports = function data(git, options, callback) {
    var packageName = path.basename(git, path.extname(git));
    var packagePath = path.join(dest, packageName);
    var tsdsPackagePath = path.resolve(packagePath, 'node_modules', 'ts-dev-stack');
    var tsdsBinPath = path.resolve(packagePath, 'node_modules', '.bin', 'tsds');
    // return callback(null, packagePath);
    console.log('------------------');
    console.log("Preparing: ".concat(packagePath));
    access(packagePath, function(err) {
        var queue = new Queue(1);
        if (!err && options.clean) {
            rimraf2.sync(packagePath, {
                disableGlob: true
            });
            err = true;
        }
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
                cwd: packagePath
            }));
            queue.defer(spawn.bind(null, 'git', [
                'reset',
                '--hard',
                'HEAD'
            ], {
                stdio: 'inherit',
                cwd: packagePath
            }));
            queue.defer(spawn.bind(null, 'git', [
                'pull',
                '--rebase'
            ], {
                stdio: 'inherit',
                cwd: packagePath
            }));
        }
        queue.defer(spawn.bind(null, 'nvu', [
            'lts',
            '--silent',
            'npm',
            'install'
        ], {
            stdio: 'inherit',
            cwd: packagePath
        }));
        // link package
        queue.defer(fs.rename.bind(null, tsdsPackagePath, "".concat(tsdsPackagePath, ".tsds")));
        queue.defer(fs.symlink.bind(null, path.resolve(__dirname, '..', '..'), tsdsPackagePath, 'dir'));
        // link bin
        queue.defer(fs.rename.bind(null, tsdsBinPath, "".concat(tsdsBinPath, ".tsds")));
        queue.defer(fs.symlink.bind(null, path.resolve(__dirname, '..', '..', 'bin', 'cli.js'), tsdsBinPath, 'file'));
        queue.await(function(err) {
            console.log('------------------');
            err ? callback(err) : callback(null, packagePath);
        });
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
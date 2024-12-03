"use strict";
var fs = require('fs');
var path = require('path');
var Queue = require('queue-cb');
var spawn = require('cross-spawn-cb');
var tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
var mkdirp = require('mkdirp');
var shortHash = require('short-hash');
var prepareGit = require('./prepareGit');
module.exports = function data(git, options, callback) {
    var cwd = options.cwd || process.cwd();
    var pkg = require(path.join(cwd, 'package.json'));
    var dest = path.join(tmpdir(), pkg.name, shortHash(cwd));
    var targetName = path.basename(git, path.extname(git));
    var targetPath = path.join(dest, targetName);
    mkdirp.sync(dest);
    var queue = new Queue(1);
    for(var binName in pkg.bin){
        var packagePath = path.resolve(targetPath, 'node_modules', pkg.name);
        var binPath = path.resolve(targetPath, 'node_modules', '.bin', binName);
        console.log('------------------');
        console.log("Preparing: ".concat(targetPath));
        // clone or reset the git repo
        queue.defer(prepareGit.bind(null, git, options));
        // install
        queue.defer(spawn.bind(null, 'nvu', [
            'lts',
            '--silent',
            'npm',
            'install'
        ], {
            stdio: 'inherit',
            cwd: targetPath
        }));
        // link package
        queue.defer(fs.rename.bind(null, packagePath, "".concat(packagePath, ".tsds")));
        queue.defer(fs.symlink.bind(null, cwd, packagePath, 'dir'));
        // link bin
        queue.defer(fs.rename.bind(null, binPath, "".concat(binPath, ".tsds")));
        queue.defer(fs.symlink.bind(null, path.resolve.apply(null, [
            cwd
        ].concat(pkg.bin[binName].split('/'))), binPath, 'file'));
        queue.await(function(err) {
            console.log('------------------');
            err ? callback(err) : callback(null, targetPath);
        });
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
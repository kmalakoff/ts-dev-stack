"use strict";
var path = require('path');
var Queue = require('queue-cb');
var rimraf2 = require('rimraf2');
var _require = require('tsds-lib'), installPath = _require.installPath, link = _require.link, spawn = _require.spawn, optionsToArgs = _require.optionsToArgs;
var major = +process.versions.node.split('.')[0];
var mochaName = major < 12 ? 'mocha-compat' : 'mocha';
var binC8 = null;
var binMocha = null;
module.exports = function c8(_args, options, cb) {
    if (!binC8) binC8 = require.resolve('c8/bin/c8');
    if (!binMocha) binMocha = require.resolve("".concat(mochaName, "/bin/_").concat(mochaName));
    var cwd = options.cwd || process.cwd();
    link(installPath(options), function(err, restore) {
        if (err) return cb(err);
        var queue = new Queue(1);
        queue.defer(function(cb) {
            rimraf2(path.resolve(process.cwd(), {
                disableGlob: true
            }, 'coverage'), function() {
                cb();
            });
        });
        queue.defer(function(cb) {
            var args = [
                binC8,
                '--config',
                path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json')
            ];
            args = args.concat([
                binMocha,
                '--watch-extensions',
                'ts,tsx'
            ]);
            args = args.concat(optionsToArgs(options));
            args = args.concat(_args.length ? _args.slice(-1) : [
                'test/**/*.test.*'
            ]);
            spawn('ts-swc', args, {
                cwd: cwd
            }, cb);
        });
        queue.await(function(err) {
            restore(function(err2) {
                cb(err || err2);
            });
        });
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
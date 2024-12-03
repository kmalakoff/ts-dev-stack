"use strict";
var Queue = require('queue-cb');
var _require = require('tsds-lib'), link = _require.link, installPath = _require.installPath, spawn = _require.spawn, optionsToArgs = _require.optionsToArgs;
var major = +process.versions.node.split('.')[0];
var mochaName = major < 12 ? 'mocha-compat' : 'mocha';
var binMocha = null;
module.exports = function command(_args, options, cb) {
    if (!binMocha) binMocha = require.resolve("".concat(mochaName, "/bin/_").concat(mochaName));
    var cwd = options.cwd || process.cwd();
    link(installPath(options), function(_err, restore) {
        var queue = new Queue(1);
        queue.defer(function(cb) {
            var args = [
                binMocha,
                '--watch-extensions',
                'ts,tsx'
            ];
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
module.exports.options = {
    alias: {
        temp: 't'
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
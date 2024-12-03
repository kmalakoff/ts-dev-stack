"use strict";
var path = require('path');
var Queue = require('queue-cb');
var _require = require('tsds-lib'), link = _require.link, installPath = _require.installPath, spawn = _require.spawn;
module.exports = function karma(args, options, cb) {
    link(installPath(options), function(_err, restore) {
        var queue = new Queue(1);
        queue.defer(function(cb) {
            var tests = args.length ? args[0] : 'test/**/*.test.*';
            spawn('karma', [
                'start',
                path.join(__dirname, '..', '..', '..', 'assets', 'karma.conf.js'),
                tests
            ], {}, cb);
        });
        queue.await(function(err) {
            restore(function(err2) {
                cb(err || err2);
            });
        });
    });
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
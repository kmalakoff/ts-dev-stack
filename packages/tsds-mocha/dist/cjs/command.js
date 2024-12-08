"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return command;
    }
});
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _resolve = /*#__PURE__*/ _interop_require_default(require("resolve"));
var _tsdslib = require("tsds-lib");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
var mocha = major < 12 ? (0, _tsdslib.binPath)(_resolve.default.sync('mocha-compat/package.json', {
    basedir: __dirname
}), '_mocha-compat') : (0, _tsdslib.binPath)(_resolve.default.sync('mocha/package.json', {
    basedir: __dirname
}), '_mocha');
var loader = (0, _tsdslib.binPath)(_resolve.default.sync('ts-swc-loaders/package.json', {
    basedir: __dirname
}), 'ts-swc');
function command(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    (0, _tsdslib.link)((0, _tsdslib.installPath)(options), function(_err, restore) {
        var queue = new _queuecb.default(1);
        queue.defer(function(cb) {
            var args = [
                mocha,
                '--watch-extensions',
                'ts,tsx'
            ];
            Array.prototype.push.apply(args, (0, _tsdslib.optionsToArgs)(options));
            Array.prototype.push.apply(args, _args.length ? _args.slice(-1) : [
                'test/**/*.test.*'
            ]);
            (0, _tsdslib.spawn)(loader, args, {
                cwd: cwd
            }, cb);
        });
        queue.await(function(err) {
            restore(function(err2) {
                cb(err || err2);
            });
        });
    });
}
module.exports.options = {
    alias: {
        temp: 't'
    }
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
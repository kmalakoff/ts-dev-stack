"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return c8;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _resolve = /*#__PURE__*/ _interop_require_default(require("resolve"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
var _tsdslib = require("tsds-lib");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
var _c8 = (0, _tsdslib.binPath)(_resolve.default.sync('c8/package.json', {
    basedir: __dirname
}));
var mocha = major < 12 ? (0, _tsdslib.binPath)(_resolve.default.sync('mocha-compat/package.json', {
    basedir: __dirname
}), '_mocha-compat') : (0, _tsdslib.binPath)(_resolve.default.sync('mocha/package.json', {
    basedir: __dirname
}), '_mocha');
var loader = (0, _tsdslib.binPath)(_resolve.default.sync('ts-swc-loaders/package.json', {
    basedir: __dirname
}), 'ts-swc');
function c8(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    (0, _tsdslib.link)((0, _tsdslib.installPath)(options), function(err, restore) {
        if (err) return cb(err);
        var queue = new _queuecb.default(1);
        queue.defer(function(cb) {
            (0, _rimraf2.default)(_path.default.resolve(process.cwd(), {
                disableGlob: true
            }, 'coverage'), function() {
                cb();
            });
        });
        queue.defer(function(cb) {
            var args = [
                loader,
                c8,
                '--config',
                _path.default.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json')
            ];
            Array.prototype.push(args, [
                mocha,
                '--watch-extensions',
                'ts,tsx'
            ]);
            Array.prototype.push.apply(args, (0, _tsdslib.optionsToArgs)(options));
            Array.prototype.push.apply(args, _args.length ? _args.slice(-1) : [
                'test/**/*.test.*'
            ]);
            (0, _tsdslib.spawn)(args[0], args.slice(1), {
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
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
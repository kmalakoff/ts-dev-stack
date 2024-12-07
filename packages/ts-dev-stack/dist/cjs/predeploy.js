"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return predeploy;
    }
});
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _tsdsbiome = /*#__PURE__*/ _interop_require_default(require("tsds-biome"));
var _tsdsbuild = /*#__PURE__*/ _interop_require_default(require("tsds-build"));
var _sync = /*#__PURE__*/ _interop_require_default(require("resolve/sync"));
var _tsdslib = require("tsds-lib");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var major = typeof process === 'undefined' ? Infinity : +process.versions.node.split('.')[0];
var nvu = (0, _tsdslib.binPath)((0, _sync.default)('node-version-use/package.json', {
    basedir: __dirname
}), 'nvu');
function predeploy(args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var queue = new _queuecb.default(1);
    queue.defer(_tsdsbiome.default.bind(null, args, options));
    queue.defer(_tsdsbuild.default.bind(null, args, options));
    (function() {
        var _$args = [
            'sort-package-json'
        ];
        if (major < 14) _$args = [
            nvu,
            'stable'
        ].concat(_$args);
        queue.defer(_tsdslib.spawn.bind(null, _$args[0], _$args.slice(1), {
            cwd: cwd
        }));
    })();
    (function() {
        var _$args = [
            'depcheck'
        ];
        if (major < 14) _$args = [
            nvu,
            'stable'
        ].concat(_$args);
        queue.defer(_tsdslib.spawn.bind(null, _$args[0], _$args.slice(1), {
            cwd: cwd
        }));
    })();
    queue.await(cb);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
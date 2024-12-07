"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return format;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _mkdirp = /*#__PURE__*/ _interop_require_default(require("mkdirp"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _sync = /*#__PURE__*/ _interop_require_default(require("resolve/sync"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
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
function format(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = (0, _tsdslib.source)(options);
    var dest = _path.default.resolve(process.cwd(), 'docs');
    var args = [
        'typedoc',
        src
    ];
    if (major < 14) args = [
        nvu,
        'stable'
    ].concat(args);
    (0, _rimraf2.default)(dest, {
        disableGlob: true
    }, function() {
        var queue = new _queuecb.default(1);
        queue.defer(_mkdirp.default.bind(null, dest));
        queue.defer(_tsdslib.spawn.bind(null, args[0], args.slice(1), {
            cwd: cwd
        }));
        queue.await(cb);
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return types;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _fsiterator = /*#__PURE__*/ _interop_require_default(require("fs-iterator"));
var _gettsconfigcompat = /*#__PURE__*/ _interop_require_default(require("get-tsconfig-compat"));
var _sync = /*#__PURE__*/ _interop_require_default(require("resolve/sync"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
var _tsswctransform = require("ts-swc-transform");
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
function types(_args, options, cb) {
    var cwd = options.cwd || process.cwd();
    var src = (0, _tsdslib.source)(options);
    var srcFolder = _path.default.dirname(_path.default.resolve(cwd, src));
    var dest = _path.default.join(cwd, 'dist', 'types');
    var config = _gettsconfigcompat.default.getTsconfig(_path.default.resolve(cwd, 'tsconfig.json'));
    var matcher = (0, _tsswctransform.createMatcher)(config);
    var tsArgs = [];
    for(var key in config.config.compilerOptions){
        var value = config.config.compilerOptions[key];
        tsArgs.push("--".concat(key));
        tsArgs.push(Array.isArray(value) ? value.join(',') : value);
    }
    (0, _rimraf2.default)(dest, {
        disableGlob: true
    }, function() {
        var files = [];
        var iterator = new _fsiterator.default(srcFolder);
        iterator.forEach(function(entry, callback) {
            if (!entry.stats.isFile()) return callback();
            if (!matcher(entry.fullPath)) return callback();
            files.push(entry.fullPath);
            callback();
        }, {
            callbacks: true,
            concurrency: 1024
        }, function(err) {
            if (err) return cb(err);
            var args = [
                'tsc',
                files,
                '--declaration',
                '--emitDeclarationOnly',
                '--outDir',
                dest
            ].concat(tsArgs);
            if (major < 14) args = [
                nvu,
                'stable'
            ].concat(args);
            (0, _tsdslib.spawn)(args[0], args.slice(1), {
                cwd: cwd
            }, cb);
        });
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
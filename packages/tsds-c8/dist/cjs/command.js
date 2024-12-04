"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    default: function() {
        return c8;
    },
    installPath: function() {
        return _tsdslib.installPath;
    },
    link: function() {
        return _tsdslib.link;
    },
    optionsToArgs: function() {
        return _tsdslib.optionsToArgs;
    },
    spawn: function() {
        return _tsdslib.spawn;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _rimraf2 = /*#__PURE__*/ _interop_require_default(require("rimraf2"));
var _tsdslib = require("tsds-lib");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var major = +process.versions.node.split('.')[0];
var mochaName = major < 12 ? 'mocha-compat' : 'mocha';
var binC8 = null;
var binMocha = null;
function c8(_args, options, cb) {
    if (!binC8) binC8 = require.resolve('c8/bin/c8');
    if (!binMocha) binMocha = require.resolve("".concat(mochaName, "/bin/_").concat(mochaName));
    var cwd = options.cwd || process.cwd();
    link(installPath(options), function(err, restore) {
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
                binC8,
                '--config',
                _path.default.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json')
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
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
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
var _tsdslib = require("tsds-lib");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var major = +process.versions.node.split('.')[0];
var mochaName = major < 12 ? 'mocha-compat' : 'mocha';
var binMocha = null;
function command(_args, options, cb) {
    if (!binMocha) binMocha = require.resolve("".concat(mochaName, "/bin/_").concat(mochaName));
    var cwd = options.cwd || process.cwd();
    (0, _tsdslib.link)((0, _tsdslib.installPath)(options), function(_err, restore) {
        var queue = new _queuecb.default(1);
        queue.defer(function(cb) {
            var args = [
                binMocha,
                '--watch-extensions',
                'ts,tsx'
            ];
            args = args.concat((0, _tsdslib.optionsToArgs)(options));
            args = args.concat(_args.length ? _args.slice(-1) : [
                'test/**/*.test.*'
            ]);
            (0, _tsdslib.spawn)('ts-swc', args, {
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
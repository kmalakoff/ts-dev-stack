"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return karma;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _tsdslib = require("tsds-lib");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function karma(args, options, cb) {
    (0, _tsdslib.link)((0, _tsdslib.installPath)(options), function(_err, restore) {
        var queue = new _queuecb.default(1);
        queue.defer(function(cb) {
            var tests = args.length ? args[0] : 'test/**/*.test.*';
            (0, _tsdslib.spawn)('karma', [
                'start',
                _path.default.join(__dirname, '..', '..', '..', 'assets', 'karma.conf.js'),
                tests
            ], {}, cb);
        });
        queue.await(function(err) {
            restore(function(err2) {
                cb(err || err2);
            });
        });
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
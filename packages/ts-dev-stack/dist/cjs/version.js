"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return version;
    }
});
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
var _tsdslib = require("tsds-lib");
var _tsdstypedoc = /*#__PURE__*/ _interop_require_default(require("tsds-typedoc"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function version(_args, _options, cb) {
    var queue = new _queuecb.default(1);
    queue.defer(_tsdstypedoc.default.bind(null, _args, _options));
    queue.defer(_tsdslib.spawn.bind(null, 'git', [
        'add',
        'docs'
    ], {}));
    queue.await(cb);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
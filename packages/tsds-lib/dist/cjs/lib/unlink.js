"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return unlink;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _queuecb = /*#__PURE__*/ _interop_require_default(require("queue-cb"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function unlink(target, cb) {
    var movedPath = _path.default.join(_path.default.dirname(target), "".concat(_path.default.basename(target), ".tsds"));
    var queue = new _queuecb.default(1);
    queue.defer(_fs.default.unlink.bind(null, target));
    queue.defer(_fs.default.rename.bind(null, movedPath, target));
    queue.await(function() {
        cb();
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
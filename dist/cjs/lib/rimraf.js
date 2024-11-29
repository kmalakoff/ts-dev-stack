"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return rimraf2;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
var _fsiterator = /*#__PURE__*/ _interop_require_default(require("fs-iterator"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function rimraf2(dir, callback) {
    var iterator = new _fsiterator.default(dir);
    iterator.forEach(function(entry, callback) {
        if (entry.stats.isDirectory()) return _fs.default.rimraf2(entry.fullPath, callback);
        _fs.default.unlink(entry.fullPath, callback);
    }, {
        callbacks: true
    }, callback);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }
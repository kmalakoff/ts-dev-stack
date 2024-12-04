"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return source;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _config = /*#__PURE__*/ _interop_require_default(require("./config"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function source(options) {
    var tsds = (0, _config.default)(options);
    if (!tsds.source) console.log('Using default source: src/index.ts. Add "tsds": { "source": "src/index.ts" } to your package.json');
    return (tsds.source ? tsds.source.split('/') : [
        'src',
        'index.ts'
    ]).join(_path.default.sep);
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
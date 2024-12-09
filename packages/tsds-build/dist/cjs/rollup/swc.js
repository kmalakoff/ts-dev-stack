"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return swcPlugin;
    }
});
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _gettsconfigcompat = /*#__PURE__*/ _interop_require_default(require("get-tsconfig-compat"));
var _tsswctransform = require("ts-swc-transform");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var config = _gettsconfigcompat.default.getTsconfig(_path.default.resolve(process.cwd(), 'tsconfig.json'));
config.config.compilerOptions.target = 'ES5';
var matcher = (0, _tsswctransform.createMatcher)(config);
function swcPlugin() {
    return {
        name: 'swc',
        transform: function transform(contents, filename) {
            if (!matcher(filename)) return null;
            return (0, _tsswctransform.transformSync)(contents, filename, config);
        }
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
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
var _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
var _gettsconfigcompat = /*#__PURE__*/ _interop_require_default(require("get-tsconfig-compat"));
var _tsswcloaders = require("ts-swc-loaders");
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var config = _gettsconfigcompat.default.getTsconfig(_nodepath.default.resolve(process.cwd(), 'tsconfig.json'));
config.config.compilerOptions.target = 'ES5';
var matcher = (0, _tsswcloaders.createMatcher)(config);
function swcPlugin() {
    return {
        name: 'swc',
        transform: function transform(contents, filename) {
            if (!matcher(filename)) return null;
            return (0, _tsswcloaders.transformSync)(contents, filename, config);
        }
    };
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }
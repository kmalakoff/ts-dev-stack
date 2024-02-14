"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return _default;
    }
});
var _fs = /*#__PURE__*/ _interop_require_default(require("fs"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var _default = function() {
    // make it commonjs
    var packageFile = require.resolve("yargs/package.json");
    var contents = _fs.default.readFileSync(packageFile, "utf8");
    var pkg = JSON.parse(contents);
    pkg.type = "commonjs";
    _fs.default.writeFileSync(packageFile, JSON.stringify(pkg, null, 2), "utf8");
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}
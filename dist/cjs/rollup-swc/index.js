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
var _path = /*#__PURE__*/ _interop_require_default(require("path"));
var _pluginnoderesolve = /*#__PURE__*/ _interop_require_default(require("@rollup/plugin-node-resolve"));
var _pluginterser = /*#__PURE__*/ _interop_require_default(require("@rollup/plugin-terser"));
var _justextend = /*#__PURE__*/ _interop_require_default(require("just-extend"));
var _lodashcamelcase = /*#__PURE__*/ _interop_require_default(require("lodash.camelcase"));
var _rolluppluginnodeexternals = /*#__PURE__*/ _interop_require_default(require("rollup-plugin-node-externals"));
var _swc = /*#__PURE__*/ _interop_require_default(require("./swc.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var pkg = JSON.parse(_fs.default.readFileSync(_path.default.join(process.cwd(), "package.json"), "utf8"));
var DEPS = [
    "",
    "dependencies",
    "optionalDependencies",
    "peerDependencies"
];
var deps = _justextend.default.apply(null, DEPS.map(function(x) {
    return pkg[x] || {};
}));
var globals = pkg.tsds ? pkg.tsds.globals || {} : {};
Object.keys(deps).forEach(function(x) {
    if (globals[x] === undefined) console.log("umd dependency ".concat(x, 'is missing. Add a "tsds": { "globals": { "${x}": "SomeName" } } to your package.json'));
});
var _default = {
    output: [
        {
            file: _path.default.resolve(process.cwd(), "dist", "umd", "".concat(pkg.name, ".js")),
            format: "umd",
            sourcemap: true,
            name: (0, _lodashcamelcase.default)(pkg.name),
            globals: globals
        },
        {
            file: _path.default.resolve(process.cwd(), "dist", "umd", "".concat(pkg.name, ".min.js")),
            format: "umd",
            name: (0, _lodashcamelcase.default)(pkg.name),
            sourcemap: true,
            plugins: [
                (0, _pluginterser.default)()
            ],
            globals: globals
        }
    ],
    plugins: [
        (0, _rolluppluginnodeexternals.default)({
            devDeps: false
        }),
        (0, _pluginnoderesolve.default)(),
        (0, _swc.default)()
    ]
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}
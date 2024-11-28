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
var _nodefs = /*#__PURE__*/ _interop_require_default(require("node:fs"));
var _nodepath = /*#__PURE__*/ _interop_require_default(require("node:path"));
var _pluginnoderesolve = /*#__PURE__*/ _interop_require_default(require("@rollup/plugin-node-resolve"));
var _pluginterser = /*#__PURE__*/ _interop_require_default(require("@rollup/plugin-terser"));
var _lodashcamelcase = /*#__PURE__*/ _interop_require_default(require("lodash.camelcase"));
var _rolluppluginnodeexternals = /*#__PURE__*/ _interop_require_default(require("rollup-plugin-node-externals"));
var _swc = /*#__PURE__*/ _interop_require_default(require("./swc.js"));
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
var pkg = JSON.parse(_nodefs.default.readFileSync(_nodepath.default.join(process.cwd(), 'package.json'), 'utf8'));
var globals = pkg.tsds ? pkg.tsds.globals || {} : {};
var DEPS = [
    'dependencies',
    'optionalDependencies',
    'peerDependencies'
];
DEPS.forEach(function(x) {
    var deps = pkg[x] || {};
    for(var name in deps){
        if (globals[name] === undefined) console.log("umd dependency ".concat(name, 'is missing. Add a "tsds": { "globals": { "${name}": "SomeName" } } to your package.json'));
    }
});
var _default = {
    output: [
        {
            file: _nodepath.default.resolve(process.cwd(), 'dist', 'umd', "".concat(pkg.name, ".js")),
            format: 'umd',
            sourcemap: true,
            name: (0, _lodashcamelcase.default)(pkg.name),
            globals: globals
        },
        {
            file: _nodepath.default.resolve(process.cwd(), 'dist', 'umd', "".concat(pkg.name, ".min.js")),
            format: 'umd',
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
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }
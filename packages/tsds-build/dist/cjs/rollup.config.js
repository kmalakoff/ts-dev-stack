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
var _gettsconfigcompat = /*#__PURE__*/ _interop_require_default(require("get-tsconfig-compat"));
var _lodashcamelcase = /*#__PURE__*/ _interop_require_default(require("lodash.camelcase"));
var _rolluppluginnodeexternals = /*#__PURE__*/ _interop_require_default(require("rollup-plugin-node-externals"));
var _tsswcrollupplugin = /*#__PURE__*/ _interop_require_default(require("ts-swc-rollup-plugin"));
function _define_property(obj, key, value) {
    if (key in obj) {
        Object.defineProperty(obj, key, {
            value: value,
            enumerable: true,
            configurable: true,
            writable: true
        });
    } else {
        obj[key] = value;
    }
    return obj;
}
function _interop_require_default(obj) {
    return obj && obj.__esModule ? obj : {
        default: obj
    };
}
function _object_spread(target) {
    for(var i = 1; i < arguments.length; i++){
        var source = arguments[i] != null ? arguments[i] : {};
        var ownKeys = Object.keys(source);
        if (typeof Object.getOwnPropertySymbols === "function") {
            ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function(sym) {
                return Object.getOwnPropertyDescriptor(source, sym).enumerable;
            }));
        }
        ownKeys.forEach(function(key) {
            _define_property(target, key, source[key]);
        });
    }
    return target;
}
function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);
    if (Object.getOwnPropertySymbols) {
        var symbols = Object.getOwnPropertySymbols(object);
        if (enumerableOnly) {
            symbols = symbols.filter(function(sym) {
                return Object.getOwnPropertyDescriptor(object, sym).enumerable;
            });
        }
        keys.push.apply(keys, symbols);
    }
    return keys;
}
function _object_spread_props(target, source) {
    source = source != null ? source : {};
    if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
        ownKeys(Object(source)).forEach(function(key) {
            Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
    }
    return target;
}
var pkg = JSON.parse(_fs.default.readFileSync(_path.default.join(process.cwd(), 'package.json'), 'utf8'));
var globals = pkg.tsds ? pkg.tsds.globals || {} : {};
var DEPS = [
    'dependencies',
    'optionalDependencies',
    'peerDependencies'
];
DEPS.forEach(function(x) {
    var deps = pkg[x] || {};
    for(var name in deps){
        if (globals[name] === undefined) console.log("umd dependency ".concat(name, 'is missing. Add a "tsds": { "globals": { "').concat(name, '": "SomeName" } } to your package.json'));
    }
});
var tsconfig = _gettsconfigcompat.default.getTsconfig();
tsconfig.config.compilerOptions = _object_spread_props(_object_spread({}, tsconfig.config.compilerOptions), {
    target: 'ES5'
});
var _default = {
    output: [
        {
            file: _path.default.resolve(process.cwd(), 'dist', 'umd', "".concat(pkg.name, ".js")),
            format: 'umd',
            sourcemap: true,
            name: (0, _lodashcamelcase.default)(pkg.name),
            globals: globals
        },
        {
            file: _path.default.resolve(process.cwd(), 'dist', 'umd', "".concat(pkg.name, ".min.js")),
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
            devDeps: false,
            builtinsPrefix: 'strip'
        }),
        (0, _pluginnoderesolve.default)(),
        (0, _tsswcrollupplugin.default)({
            tsconfig: tsconfig
        })
    ]
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
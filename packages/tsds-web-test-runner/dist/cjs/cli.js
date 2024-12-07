"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return cli;
    }
});
var _exit = /*#__PURE__*/ _interop_require_default(require("exit"));
var _getoptscompat = /*#__PURE__*/ _interop_require_default(require("getopts-compat"));
var _index = /*#__PURE__*/ _interop_require_default(require("./index.js"));
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
var optionsCLI = {
    alias: {
        config: 'c'
    }
};
function cli(argv, _name) {
    var options = (0, _getoptscompat.default)(argv.slice(1), _object_spread({
        stopEarly: true
    }, optionsCLI));
    var args = argv.slice(0, 1).concat(options._);
    (0, _index.default)(args.slice(1), options, function(err) {
        if (err && err.message.indexOf('ExperimentalWarning') < 0) {
            console.log(err.message);
            return (0, _exit.default)(err.code || -1);
        }
        (0, _exit.default)(0);
    });
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
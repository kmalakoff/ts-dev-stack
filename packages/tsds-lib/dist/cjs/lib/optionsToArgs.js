"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
Object.defineProperty(exports, "default", {
    enumerable: true,
    get: function() {
        return optionsToArgs;
    }
});
function optionsToArgs(options) {
    var args = [];
    for(var key in options){
        if (key === '_') continue;
        if (options[key] === true) args.push("--".concat(key));
        else if (options[key] === false) args.push("--no-".concat(key));
        else args = args.concat([
            "--".concat(key),
            options[key]
        ]);
    }
    return args;
}
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
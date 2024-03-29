"use strict";
module.exports = function regexDependencies(esm) {
    var matchingDeps = "\\s*['\"`]([^'\"`]+)['\"`]\\s*";
    var matchingName = "\\s*(?:[\\w${},\\s*]+)\\s*";
    var regex = "(?:(?:var|const|let)".concat(matchingName, "=\\s*)?require\\(").concat(matchingDeps, "\\);?");
    if (esm) {
        regex += "|import(?:".concat(matchingName, "from\\s*)?").concat(matchingDeps, ";?");
        regex += "|export(?:".concat(matchingName, "from\\s*)?").concat(matchingDeps, ";?");
    }
    return new RegExp(regex, "g");
};
/* CJS INTEROP */ if (exports.__esModule && exports.default) { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) exports.default[key] = exports[key]; module.exports = exports.default; }
"use strict";
module.exports = [
    '.js',
    '.jsx',
    '.es6',
    '.es',
    '.cjs',
    '.mjs',
    '.ts',
    '.tsx',
    '.json'
];
/* CJS INTEROP */ if (exports.__esModule && exports.default) { try { Object.defineProperty(exports.default, '__esModule', { value: true }); for (var key in exports) { exports.default[key] = exports[key]; } } catch (_) {}; module.exports = exports.default; }
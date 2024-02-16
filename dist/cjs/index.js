"use strict";
module.exports = {
    build: require("./build"),
    coverage: require("./test/c8"),
    deploy: require("./deploy"),
    docs: require("./docs/ndex"),
    format: require("./quality/format"),
    link: require("./link"),
    test: require("./test"),
    "test:node": require("./test/mocha"),
    "test:browser": require("./test/karma"),
    unlink: require("./unlink"),
    version: require("./deploy/version")
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}
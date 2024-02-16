"use strict";
var path = require("path");
var getTS = require("get-tsconfig-compat");
var transformSync = require("ts-swc-loaders").transformSync;
// const { createMatcher } = require('ts-swc-loaders');
var config = getTS.getTsconfig(path.resolve(process.cwd(), "tsconfig.json"));
config.config.compilerOptions.target = "ES5";
// var matcher = createMatcher(config);
module.exports = function swcPlugin() {
    return {
        name: "swc",
        transform: function transform(contents, filename) {
            // TODO: test includes works:
            // "include": ["src", "test", "node_modules/index-of-newline"]
            // if (!matcher(filename)) return null;
            return transformSync(contents, filename, config);
        }
    };
};

if ((typeof exports.default === 'function' || (typeof exports.default === 'object' && exports.default !== null)) && typeof exports.default.__esModule === 'undefined') {
  Object.defineProperty(exports.default, '__esModule', { value: true });
  for (var key in exports) exports.default[key] = exports[key];
  module.exports = exports.default;
}
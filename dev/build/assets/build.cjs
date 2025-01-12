"use strict";
function _type_of(obj) {
    "@swc/helpers - typeof";
    return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj;
}
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = function __copyProps(to, from, except, desc) {
    if (from && (typeof from === "undefined" ? "undefined" : _type_of(from)) === "object" || typeof from === "function") for(var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++){
        key = keys[i];
        if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
            get: (function(k) {
                return from[k];
            }).bind(null, key),
            enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
        });
    }
    return to;
};
var __toESM = function __toESM(mod, isNodeMode, target) {
    return target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
        value: mod,
        enumerable: true
    }) : target, mod);
};
//#endregion
var fs = __toESM(require("fs"));
var path = __toESM(require("path"));
var queue_cb = __toESM(require("queue-cb"));
var rimraf2 = __toESM(require("rimraf2"));
var ts_swc_transform = __toESM(require("ts-swc-transform"));
//#region src/index.ts
var MAX_FILES = 10;
var reportFn = function reportFn(dest, type, cb) {
    return function(err, results) {
        if (err) console.log("".concat(type, " failed: ").concat(err.message));
        else console.log("Created ".concat(results.length < MAX_FILES ? results.map(function(x) {
            return "dist/".concat(type, "/").concat(path.default.relative(dest, x));
        }).join(",") : "".concat(results.length, " files in dist/").concat(type)));
        cb(err);
    };
};
function build(callback) {
    var cwd = process.cwd();
    var config = JSON.parse(fs.default.readFileSync(path.default.join(cwd, "package.json"), "utf8")).tsds;
    var src = path.default.dirname(path.default.join(cwd, config.source));
    var dest = path.default.join(cwd, "dist");
    var options = {
        extensions: {
            cjs: ".cjs",
            esm: ".mjs"
        },
        sourceMaps: true
    };
    var queue = new queue_cb.default(1);
    queue.defer(rimraf2.default.bind(null, dest, {
        disableGlob: true
    }));
    queue.defer(function(cb) {
        return (0, ts_swc_transform.transformDirectory)(src, path.default.join(dest, "cjs"), "cjs", options, reportFn(dest, "cjs", cb));
    });
    queue.defer(function(cb) {
        return (0, ts_swc_transform.transformDirectory)(src, path.default.join(dest, "esm"), "esm", options, reportFn(dest, "esm", cb));
    });
    queue.defer(function(cb) {
        return (0, ts_swc_transform.transformTypes)(src, path.default.join(dest, "types"), reportFn(dest, "types", cb));
    });
    queue.await(callback);
}
//#endregion
module.exports = build;

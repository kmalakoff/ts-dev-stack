"use strict";
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const fs = __toESM(require("fs"));
const path = __toESM(require("path"));
const queue_cb = __toESM(require("queue-cb"));
const rimraf2 = __toESM(require("rimraf2"));
const fs_iterator = __toESM(require("fs-iterator"));
const mkdirp_classic = __toESM(require("mkdirp-classic"));
const ts_swc_transform = __toESM(require("ts-swc-transform"));

//#region src/files.ts
const MAX_FILES = 10;
const reportFn = (dest, type, cb) => (err, results) => {
	if (err) console.log(`${type} failed: ${err.message}`);
	else console.log(`Created ${results.length < MAX_FILES ? results.map((x) => `dist/${type}/${path.default.relative(dest, x)}`).join(",") : `${results.length} files in dist/${type}`}`);
	cb(err);
};
function files(config, type, options, callback) {
	const cwd = options.cwd || process.cwd();
	const src = path.default.dirname(path.default.join(cwd, config.source));
	const dest = path.default.join(cwd, "dist", type);
	(0, mkdirp_classic.default)(dest, (err) => {
		if (err) return callback(err);
		const queue = new queue_cb.default();
		queue.defer(fs.default.writeFile.bind(null, path.default.join(dest, "package.json"), `{ "type": "${type === "cjs" ? "commonjs" : "module"}" }`, "utf8"));
		queue.defer((cb) => (0, ts_swc_transform.transformDirectory)(src, dest, type, {
			...options,
			type,
			sourceMaps: true
		}, reportFn(dest, type, cb)));
		queue.defer((cb) => (0, ts_swc_transform.transformTypes)(src, dest, reportFn(dest, type, cb)));
		queue.await((err$1) => {
			if (err$1) return callback(err$1);
			if (type !== "cjs") return callback();
			const iterator = new fs_iterator.default(dest);
			iterator.forEach((entry, cb) => {
				if (!entry.stats.isFile()) return cb();
				const ext = path.default.extname(entry.basename);
				if ([".js", ".mjs"].indexOf(ext) < 0) return cb();
				const relative = path.default.relative(dest, path.default.dirname(entry.fullPath));
				const sourcePath = path.default.join(dest, relative, `${entry.basename.slice(0, -ext.length)}.d.ts`);
				const destPath = path.default.join(dest, relative, `${entry.basename.slice(0, -ext.length)}.d.${ext === ".js" ? "cts" : "mts"}`);
				return fs.default.copyFile(sourcePath, destPath, (err$2) => err$2 && err$2.code !== "ENOENT" ? cb(err$2) : cb());
			}, {
				callbacks: true,
				concurrency: Infinity
			}, callback);
		});
	});
}

//#endregion
//#region src/index.ts
function build(callback) {
	const cwd = process.cwd();
	const config = JSON.parse(fs.default.readFileSync(path.default.join(cwd, "package.json"), "utf8")).tsds;
	const queue = new queue_cb.default(1);
	queue.defer(rimraf2.default.bind(null, path.default.join(cwd, "dist"), { disableGlob: true }));
	queue.defer((cb) => files(config, "cjs", {}, cb));
	queue.defer((cb) => files(config, "esm", {}, cb));
	queue.await(callback);
}

//#endregion
module.exports = build;
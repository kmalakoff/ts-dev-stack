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
const path = __toESM(require("path"));
const queue_cb = __toESM(require("queue-cb"));
const rimraf2 = __toESM(require("rimraf2"));
const fs = __toESM(require("fs"));
const module$1 = __toESM(require("module"));
const lazy_cache = __toESM(require("lazy-cache"));
const ts_swc_transform = __toESM(require("ts-swc-transform"));
const url = __toESM(require("url"));
const cross_spawn_cb = __toESM(require("cross-spawn-cb"));
const module_root_sync = __toESM(require("module-root-sync"));
const resolve_bin_sync = __toESM(require("resolve-bin-sync"));

//#region ../../packages/tsds-lib/dist/esm/lib/config.mjs
const defaults = {
	source: "src/index.ts",
	targets: ["cjs", "esm"],
	commands: {
		build: "tsds-build",
		coverage: "tsds-c8",
		publish: "./commands/publish.js",
		docs: "tsds-typedoc",
		format: "tsds-biome",
		link: "./commands/link.js",
		"test:node": "tsds-mocha",
		"test:browser": "tsds-web-test-runner",
		unlink: "./commands/unlink.js",
		version: "./commands/version.js"
	}
};
function config(options = {}) {
	if (options.config) return options.config;
	const cwd = options.cwd || process.cwd();
	const tsds = JSON.parse(fs.default.readFileSync(path.default.resolve(cwd, "package.json"), "utf8")).tsds || {};
	if (!tsds.source) console.log("Using default source: src/index.ts. Add \"tsds\": { \"source\": \"src/index.ts\" } to your package.json");
	return {
		...defaults,
		...tsds
	};
}

//#endregion
//#region ../../packages/tsds-lib/dist/esm/lib/wrapWorker.mjs
const _require = typeof require === "undefined" ? module$1.default.createRequire(require("url").pathToFileURL(__filename).href) : require;
const call = (0, lazy_cache.default)(_require)("node-version-call");
function wrapWorker(workerPath) {
	const workerLazy = (0, lazy_cache.default)(_require)(workerPath);
	return function workerWrapper$1(version, ...args) {
		if (version === "local") return workerLazy().apply(null, args);
		const callback = args.pop();
		try {
			callback(null, call()({
				version,
				callbacks: true
			}, workerPath, ...args));
		} catch (err) {
			callback(err);
		}
	};
}

//#endregion
//#region ../../packages/tsds-build/dist/esm/lib/code.mjs
const MAX_FILES$1 = 10;
function transform(_args, type$1, options, cb) {
	const cwd = options.cwd || process.cwd();
	const src = path.default.dirname(path.default.resolve(cwd, config(options).source));
	const dest = path.default.join(cwd, "dist", type$1);
	const queue = new queue_cb.default(1);
	queue.defer((cb$1) => (0, rimraf2.default)(dest, { disableGlob: true }, cb$1.bind(null, null)));
	queue.defer((cb$1) => (0, ts_swc_transform.transformDirectory)(src, dest, type$1, {
		...options,
		type: type$1,
		sourceMaps: true
	}, (err, results) => {
		if (err) console.log(`${type$1} failed: ${err.message} from ${src}`);
		else console.log(`Created ${results.length < MAX_FILES$1 ? results.map((x) => `dist/${type$1}${x}`).join(",") : `${results.length} files in dist/${type$1}`}`);
		cb$1(err);
	}));
	queue.defer(fs.default.writeFile.bind(null, path.default.join(dest, "package.json"), "{\"type\":\"commonjs\"}"));
	queue.await(cb);
}

//#endregion
//#region ../../packages/tsds-build/dist/esm/lib/types.mjs
const MAX_FILES = 10;
const type = "types";
function cjs(_args, options, cb) {
	const cwd = options.cwd || process.cwd();
	const src = path.default.dirname(path.default.resolve(cwd, config(options).source));
	const dest = path.default.join(cwd, "dist", type);
	const queue = new queue_cb.default(1);
	queue.defer((cb$1) => (0, rimraf2.default)(dest, { disableGlob: true }, cb$1.bind(null, null)));
	queue.defer((cb$1) => (0, ts_swc_transform.transformTypes)(src, dest, (err, results) => {
		if (err) console.log(`${type} failed: ${err.message} from ${src}`);
		else console.log(`Created ${results.length < MAX_FILES ? results.map((x) => `dist/${type}${x}`).join(",") : `${results.length} files in dist/${type}`}`);
		cb$1(err);
	}));
	queue.await(cb);
}

//#endregion
//#region ../../packages/tsds-build/dist/esm/lib/umd.mjs
const __dirname$1 = path.default.dirname(typeof __filename === "undefined" ? url.default.fileURLToPath(require("url").pathToFileURL(__filename).href) : __filename);
const major = +process.versions.node.split(".")[0];
const workerWrapper = wrapWorker(path.default.join((0, module_root_sync.default)(__dirname$1), "dist", "cjs", "build", "umd.js"));
function worker(_args, options, callback) {
	const cwd = options.cwd || process.cwd();
	const dest = path.default.join(cwd, "dist", "umd");
	const configRoot = path.default.join((0, module_root_sync.default)(__dirname$1), "dist", "esm", "rollup");
	try {
		const rollup = (0, resolve_bin_sync.default)("rollup");
		const queue = new queue_cb.default(1);
		queue.defer((cb) => (0, rimraf2.default)(dest, { disableGlob: true }, cb.bind(null, null)));
		queue.defer(cross_spawn_cb.default.bind(null, rollup, ["--config", path.default.join(configRoot, "config.mjs")], options));
		queue.defer(cross_spawn_cb.default.bind(null, rollup, ["--config", path.default.join(configRoot, "config.min.mjs")], options));
		queue.defer(fs.default.writeFile.bind(null, path.default.join(dest, "package.json"), "{\"type\":\"commonjs\"}"));
		queue.await(callback);
	} catch (err) {
		return callback(err);
	}
}
function umd(args, options, cb) {
	major < 14 ? workerWrapper("stable", args, options, cb) : worker(args, options, cb);
}

//#endregion
//#region ../../packages/tsds-build/dist/esm/command.mjs
function build(args, options, cb) {
	const cwd = options.cwd || process.cwd();
	const { targets } = config(options);
	const clean = options.clean === undefined ? true : options.clean;
	const dest = path.default.join(cwd, "dist");
	const queue = new queue_cb.default(1);
	!clean || queue.defer((cb$1) => (0, rimraf2.default)(dest, { disableGlob: true }, cb$1.bind(null, null)));
	targets.indexOf("cjs") < 0 || queue.defer(transform.bind(null, args, "cjs", options));
	targets.indexOf("esm") < 0 || queue.defer(transform.bind(null, args, "esm", options));
	targets.indexOf("umd") < 0 || queue.defer(umd.bind(null, args, options));
	queue.defer(cjs.bind(null, args, options));
	queue.await(cb);
}

//#endregion
//#region src/tsds-build.ts
var tsds_build_default = build;

//#endregion
module.exports = tsds_build_default;
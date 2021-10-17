/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");
var Queue = require("queue-cb");

var link = require("../../lib/link");
var extensions = require("../../lib/extensions");
var spawn = require("../../lib/spawn");

var major = +process.versions.node.split(".")[0];

module.exports = function mocha(_args, options, cb) {
  if (options.engines) {
    var rimraf = require("rimraf");
    var queue = new Queue(1);
    queue.defer(function (cb) {
      rimraf(path.resolve(process.cwd(), ".tmp"), function () {
        cb();
      });
    });
    queue.defer(
      spawn.bind(
        null,
        "babel",
        [
          path.resolve(process.cwd(), "test"),
          "--extensions",
          "'" + extensions.join(",") + "'",
          "--out-dir",
          path.resolve(process.cwd(), ".tmp"),
          "--out-file-extension",
          ".cjs",
        ],
        { env: { BABEL_ENV: "test-legacy" } }
      )
    );
    queue.defer(
      spawn.bind(
        null,
        "nvu",
        ["engines", path.resolve(__dirname, "..", "..", "..", "bin", "ts-dev-stack.js"), "test:node"],
        {}
      )
    );
    return queue.await(function (err) {
      if (options.keep) return cb(err);
      rimraf(path.resolve(process.cwd(), ".tmp"), function () {
        cb(err);
      });
    });
  }

  link(function (err) {
    if (err) return cb(err);
    var tests = _args.length ? _args.slice(-1) : major < 6 ? [".tmp/**/*.test.*"] : ["test/**/*.test.*"];

    if (major < 6) return spawn("mocha-compat", tests, {}, cb);
    if (major < 12) {
      return spawn(
        "mocha-compat",
        ["--require", path.resolve(__dirname, "cjs", "babel-register.cjs")].concat(tests),
        { env: { BABEL_ENV: "cjs" } },
        cb
      );
    } else {
      return spawn(
        "mocha",
        ["--config", path.resolve(__dirname, "esm", "mocharc.json")].concat(tests),
        { env: { BABEL_ENV: "cjs" } },
        cb
      );
    }
  });
};

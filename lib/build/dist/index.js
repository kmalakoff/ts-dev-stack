/* eslint-disable @typescript-eslint/no-var-requires */
var path = require("path");
var rimraf = require("rimraf");
var Queue = require("queue-cb");
var assign = require("just-extend");

var babel = require("./babel");
var rollup = require("./rollup");
var packages = require("./packages");
var types = require("./types");

module.exports = function build(_args, options, cb) {
  var queue = new Queue(1);
  queue.defer(function (cb) {
    rimraf(path.resolve(process.cwd(), "dist"), function () {
      cb();
    });
  });
  queue.defer(babel.bind(null, assign({}, options, { format: "cjs" })));
  queue.defer(babel.bind(null, assign({}, options, { format: "esm" })));
  queue.defer(rollup.bind(null, options));
  queue.defer(packages.bind(null, options));
  queue.defer(types.bind(null, options));
  queue.await(cb);
};

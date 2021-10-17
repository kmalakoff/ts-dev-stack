/* eslint-disable @typescript-eslint/no-var-requires */
var getopts = require("getopts-compat");
var exit = require("exit");
var assign = require("just-extend");

function done(err) {
  if (err) {
    console.log(err.message);
    return exit(err.code || -1);
  }
  exit(0);
}

module.exports = function cli(argv, name) {
  var options = getopts(argv.slice(1), {
    alias: { keep: "k" },
    boolean: ["keep"],
    stopEarly: true,
  });

  var args = argv.slice(0, 1).concat(options._);
  if (args.length === 0) {
    console.log("Command missing " + name + " [build|test:node|test:browser]");
    return exit(-1);
  }

  if (args[0] == "build") return require("./build")(args.slice(1), options, done);
  if (args[0] == "build:dist") return require("./build/dist")(args.slice(1), options, done);
  if (args[0] == "build:docs") return require("./build/docs")(args.slice(1), options, done);
  if (args[0] == "coverage:node") return require("./quality/c8")(args.slice(1), options, done);
  if (args[0] == "deploy") return require("./deploy")(args.slice(1), options, done);
  if (args[0] == "format") return require("./quality/format")(args.slice(1), options, done);
  if (args[0] == "lint") return require("./quality/lint")(args.slice(1), options, done);
  if (args[0] == "test") return require("./test")(args.slice(1), options, done);
  if (args[0] == "test:engines") return require("./test")(args.slice(1), assign(options, { engines: true }), done);
  if (args[0] == "test:node") return require("./test/mocha")(args.slice(1), options, done);
  if (args[0] == "test:browser") return require("./test/karma")(args.slice(1), options, done);

  console.log("Unrecognized command: " + args.join(" "));
  exit(-1);
};

/* eslint-disable @typescript-eslint/no-var-requires */
var assert = require("assert");
var path = require("path");
var spawn = require("cross-spawn-cb");

var CLI = path.join(__dirname, "..", "..", "bin", "ts-dev-stack.js");
var DATA_DIR = path.resolve(__dirname, "..", "data", "fetch-http-message");

var major = +process.versions.node.split(".")[0];

describe("cli", function () {
  describe("happy path", function () {
    major < 10 ||
      it("build:dist", function (done) {
        spawn(CLI, ["build:dist"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
          assert.ok(!err);
          done();
        });
      });

    it("test:node", function (done) {
      spawn(CLI, ["test:node"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    if (major < 12) return;

    it("build", function (done) {
      spawn(CLI, ["build"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it("build:docs", function (done) {
      spawn(CLI, ["build:docs"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it("coverage:node", function (done) {
      spawn(CLI, ["coverage:node"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("deploy", function (done) {
      spawn(CLI, ["deploy"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it("format", function (done) {
      spawn(CLI, ["format"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it("lint", function (done) {
      spawn(CLI, ["lint"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it("test", function (done) {
      spawn(CLI, ["test"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it("test:engines", function (done) {
      spawn(CLI, ["test:engines", "--keep"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it("test:browser", function (done) {
      spawn(CLI, ["test:browser"], { stdout: "inherit", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip("version", function (done) {
      spawn(CLI, ["version"], { stdout: "string", cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
  });

  describe("unhappy path", function () {
    it("missing command", function (done) {
      spawn(CLI, [], { stdout: "inherit" }, function (err) {
        assert.ok(!!err);
        done();
      });
    });
  });
});

// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');

var data = require('../lib/data');

var devStack = require('ts-dev-stack');
var GITS = ['https://github.com/kmalakoff/fetch-http-message.git', 'https://github.com/kmalakoff/parser-multipart.git'];

var major = +process.versions.node.split('.')[0];

function addTests(git) {
  describe(path.basename(git, path.extname(git)), function () {
    var packagePath = null;
    before(function (cb) {
      data(git, {}, function (err, _packagePath) {
        if (err) return cb(err);
        packagePath = _packagePath;
        process.chdir(packagePath); // TODO: get rid of this and figure out why it is needed
        cb();
      });
    });

    describe('happy path', function () {
      major < 14 ||
        it('build', function (done) {
          devStack.build([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      it('test:engines', function (done) {
        spawn('npm', ['run', 'test:engines'], { stdio: 'inherit', cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      if (major < 14) return;

      it('link', function (done) {
        devStack.link([], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('unlink', function (done) {
        devStack.unlink([], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      major < 14 ||
        it.skip('docs', function (done) {
          devStack.docs([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      major < 14 ||
        it('coverage', function (done) {
          devStack.coverage([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      // TODO: get deploy tests to work with 'no-publish'
      it.skip('deploy', function (done) {
        devStack.deploy([], { 'no-publish': true, cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
      major < 14 ||
        it.skip('format', function (done) {
          devStack.format([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      it('test', function (done) {
        devStack.test([], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('test:node', function (done) {
        devStack['test:node']([], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      major < 14 ||
        it('test:browser', function (done) {
          devStack['test:browser']([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      it.skip('version', function (done) {
        devStack.deploy(['version'], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
    });
  });
}

describe('lib', function () {
  for (var i = 0; i < GITS.length; i++) {
    addTests(GITS[i]);
  }
});

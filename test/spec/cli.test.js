var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');
var link = require('../../lib/lib/link');

var CLI = path.join(__dirname, '..', '..', 'bin', 'ts-dev-stack.js');
var DATA_DIR = path.resolve(__dirname, '..', 'data', 'fetch-http-message');

var major = +process.versions.node.split('.')[0];

describe('cli', function () {
  var restore;
  before(function (cb) {
    var pkg = require(path.join(path.resolve(__dirname, '..', '..'), 'package.json'));
    var installPath = path.resolve(DATA_DIR, 'node_modules', pkg.name);
    link(installPath, function (err, _restore) {
      cb(err, (restore = _restore));
    });
  });
  after(function (cb) {
    restore(cb);
  });

  describe('happy path', function () {
    major < 14 ||
      it('build', function (done) {
        spawn(CLI, ['build'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
          assert.ok(!err);
          done();
        });
      });

    it('test:node', function (done) {
      spawn(CLI, ['test:node'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    if (major < 14) return;

    it('link', function (done) {
      spawn(CLI, ['link'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('unlink', function (done) {
      spawn(CLI, ['unlink'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('coverage', function (done) {
      spawn(CLI, ['coverage'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    // TODO: get deploy tests to work with 'no-publish'
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('deploy', function (done) {
      spawn(CLI, ['deploy', '--no-publish'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it('format', function (done) {
      spawn(CLI, ['format'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it('lint', function (done) {
      spawn(CLI, ['lint'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it('test', function (done) {
      spawn(CLI, ['test'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    it('test:browser', function (done) {
      spawn(CLI, ['test:browser'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
    // eslint-disable-next-line mocha/no-skipped-tests
    it.skip('version', function (done) {
      spawn(CLI, ['version'], { stdout: 'string', cwd: DATA_DIR }, function (err) {
        assert.ok(!err);
        done();
      });
    });
  });

  describe('unhappy path', function () {
    it('missing command', function (done) {
      spawn(CLI, [], { stdout: 'inherit' }, function (err) {
        assert.ok(!!err);
        done();
      });
    });
  });
});

var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');

var data = require('../lib/data');

var CLI = path.join(__dirname, '..', '..', 'bin', 'ts-dev-stack.js');
var GITS = ['https://github.com/kmalakoff/fetch-http-message.git'];

var major = +process.versions.node.split('.')[0];

function addTests(git) {
  describe(path.basename(git, path.extname(git)), function () {
    var packagePath = null;
    before(function (cb) {
      data(git, {}, function (err, _packagePath) {
        if (err) return cb(err);
        packagePath = _packagePath;
        cb();
      });
    });

    describe('happy path', function () {
      major < 14 ||
        it('build', function (done) {
          spawn(CLI, ['build'], { stdout: 'inherit', cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      it('test:engines', function (done) {
        spawn('npm', ['run', 'test:engines'], { stdout: 'inherit', cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('link', function (done) {
        spawn(CLI, ['link'], { stdout: 'inherit', cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('unlink', function (done) {
        spawn(CLI, ['unlink'], { stdout: 'inherit', cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      major < 14 ||
        it('docs', function (done) {
          spawn(CLI, ['docs'], { stdout: 'inherit', cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      major < 14 ||
        it('coverage', function (done) {
          spawn(CLI, ['coverage'], { stdout: 'inherit', cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      // TODO: get deploy tests to work with 'no-publish'
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('deploy', function (done) {
        spawn(CLI, ['deploy', '--no-publish'], { stdout: 'inherit', cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
      major < 14 ||
        it.skip('format', function (done) {
          spawn(CLI, ['format'], { stdout: 'inherit', cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });
      major < 14 ||
        it.skip('lint', function (done) {
          spawn(CLI, ['lint'], { stdout: 'inherit', cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });
      it('test', function (done) {
        spawn(CLI, ['test'], { stdout: 'inherit', cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
      it('test:node', function (done) {
        spawn(CLI, ['test:node'], { stdout: 'inherit', cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
      it('test:browser', function (done) {
        spawn(CLI, ['test:browser'], { stdout: 'inherit', cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('version', function (done) {
        spawn(CLI, ['version'], { encoding: 'utf8', cwd: packagePath }, function (err) {
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
}

describe('cli', function () {
  for (var i = 0; i < GITS.length; i++) {
    addTests(GITS[i]);
  }
});

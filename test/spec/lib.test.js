var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');

var data = require('../lib/data');

var LIB = path.join(__dirname, '..', '..', 'lib');
var GITS = [
  // 'https://github.com/kmalakoff/fetch-http-message.git',
  'https://github.com/kmalakoff/newline-iterator.git',
  'https://github.com/kmalakoff/react-dom-event.git',
];

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
          require(path.join(LIB, 'build'))([], { cwd: packagePath }, function (err) {
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
        require(path.join(LIB, 'link'))([], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('unlink', function (done) {
        require(path.join(LIB, 'unlink'))([], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      major < 14 ||
        it.skip('docs', function (done) {
          require(path.join(LIB, 'docs'))([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      major < 14 ||
        it('coverage', function (done) {
          require(path.join(LIB, 'test', 'c8'))([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      // TODO: get deploy tests to work with 'no-publish'
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('deploy', function (done) {
        require(path.join(LIB, 'deploy'))([], { 'no-publish': true, cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });
      major < 14 ||
        it.skip('format', function (done) {
          require(path.join(LIB, 'quality', 'format'))([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });
      major < 14 ||
        it.skip('lint', function (done) {
          require(path.join(LIB, 'quality', 'lint'))([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      it('test', function (done) {
        require(path.join(LIB, 'test'))([], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('test:node', function (done) {
        require(path.join(LIB, 'test', 'mocha'))([], { cwd: packagePath }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      major < 14 ||
        it('test:browser', function (done) {
          require(path.join(LIB, 'test', 'karma'))([], { cwd: packagePath }, function (err) {
            assert.ok(!err);
            done();
          });
        });

      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('version', function (done) {
        require(path.join(LIB, 'deploy', 'version'))([], { cwd: packagePath }, function (err) {
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

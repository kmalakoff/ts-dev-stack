var assert = require('assert');
var path = require('path');
var spawn = require('cross-spawn-cb');
var link = require('../../lib/lib/link');

var LIB = path.join(__dirname, '..', '..', 'lib');
var DATA_DIRS = [path.resolve(__dirname, '..', 'data', 'react-dom-event'), path.resolve(__dirname, '..', 'data', 'fetch-http-message'), path.resolve(__dirname, '..', 'data', 'newline-iterator')];
DATA_DIRS.pop(); // remove newline-iterator until monorepo works

var major = +process.versions.node.split('.')[0];

function addTests(DATA_DIR) {
  describe(path.basename(DATA_DIR), function () {
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
          process.chdir(DATA_DIR);
          require(path.join(LIB, 'build'))([], {}, function (err) {
            assert.ok(!err);
            done();
          });
        });

      it('test:engines', function (done) {
        spawn('npm', ['run', 'test:engines'], { stdout: 'inherit', cwd: DATA_DIR }, function (err) {
          assert.ok(!err);
          done();
        });
      });

      if (major < 14) return;

      it('link', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'link'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('unlink', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'unlink'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('docs', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'docs'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('coverage', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'test', 'c8'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

      // TODO: get deploy tests to work with 'no-publish'
      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('deploy', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'deploy'))([], { 'no-publish': true }, function (err) {
          assert.ok(!err);
          done();
        });
      });
      it('format', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'quality', 'format'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });
      it('lint', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'quality', 'lint'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

      // TODO: support jest
      it('test', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'test'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('test:node', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'test', 'mocha'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

      it('test:browser', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'test', 'karma'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

      // eslint-disable-next-line mocha/no-skipped-tests
      it.skip('version', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'deploy', 'version'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });
    });
  });
}

describe('lib', function () {
  for (var i = 0; i < DATA_DIRS.length; i++) {
    addTests(DATA_DIRS[i]);
  }
});

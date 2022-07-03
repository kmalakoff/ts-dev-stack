var assert = require('assert');
var path = require('path');
var link = require('../../lib/lib/link');

var LIB = path.join(__dirname, '..', '..', 'lib');
var DATA_DIR = path.resolve(__dirname, '..', 'data', 'react-ref-boundary');
// var DATA_DIR = path.resolve(__dirname, '..', 'data', 'fetch-http-message');

var major = +process.versions.node.split('.')[0];

describe('lib', function () {
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

    // TODO: support jest
    it.skip('test:node', function (done) {
      process.chdir(DATA_DIR);
      require(path.join(LIB, 'test', 'mocha'))([], {}, function (err) {
        assert.ok(!err);
        done();
      });
    });
    if (major < 14) return;

    // TODO: add tests
    it('link', function (done) {
      process.chdir(DATA_DIR);
      require(path.join(LIB, 'link'))([], {}, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it('docs', function (done) {
      process.chdir(DATA_DIR);
      require(path.join(LIB, 'build', 'docs'))([], {}, function (err) {
        assert.ok(!err);
        done();
      });
    });

    // TODO: support jest
    it.skip('coverage:node', function (done) {
      process.chdir(DATA_DIR);
      require(path.join(LIB, 'quality', 'c8'))([], {}, function (err) {
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
    it.skip('test', function (done) {
      process.chdir(DATA_DIR);
      require(path.join(LIB, 'test'))([], {}, function (err) {
        assert.ok(!err);
        done();
      });
    });

    it.skip('test:browser', function (done) {
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

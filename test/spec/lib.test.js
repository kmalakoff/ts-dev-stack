/* eslint-disable @typescript-eslint/no-var-requires */
var assert = require('assert');
var path = require('path');
var linkTSDV = require('../lib/link-ts-dev-stack');

var LIB = path.join(__dirname, '..', '..', 'lib');
var DATA_DIR = path.resolve(__dirname, '..', 'data', 'react-ref-boundary');

var major = +process.versions.node.split('.')[0];

describe('lib', function () {
  before(function (cb) {
    linkTSDV({ cwd: DATA_DIR }, cb);
  });

  describe('happy path', function () {
    major < 14 ||
      it('build:dist', function (done) {
        process.chdir(DATA_DIR);
        require(path.join(LIB, 'build'))([], {}, function (err) {
          assert.ok(!err);
          done();
        });
      });

    // TODO: support jest
    // it('test:dist', function (done) {
    //   process.chdir(DATA_DIR);
    //   require(path.join(LIB, 'test'))([], {}, function (err) {
    //     assert.ok(!err);
    //     done();
    //   });
    // });
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

  it('build', function (done) {
    process.chdir(DATA_DIR);
    require(path.join(LIB, 'build'))([], {}, function (err) {
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
  // it('coverage:node', function (done) {
  //   process.chdir(DATA_DIR);
  //   require(path.join(LIB, 'quality', 'c8'))([], {}, function (err) {
  //     assert.ok(!err);
  //     done();
  //   });
  // });

  // eslint-disable-next-line mocha/no-skipped-tests
  it.only('deploy', function (done) {
    process.chdir(DATA_DIR);
    require(path.join(LIB, 'deploy'))([], {'no-publish': true}, function (err) {
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
  // it('test', function (done) {
  //   process.chdir(DATA_DIR);
  //   require(path.join(LIB, 'test'))([], {}, function (err) {
  //     assert.ok(!err);
  //     done();
  //   });
  // });

  // it('test:engines', function (done) {
  //   process.chdir(DATA_DIR);
  //   require(path.join(LIB, 'test', 'engines'))([], {}, function (err) {
  //     assert.ok(!err);
  //     done();
  //   });
  // });
  // it('test:browser', function (done) {
  //   process.chdir(DATA_DIR);
  //   require(path.join(LIB, 'test', 'karma'))([], {}, function (err) {
  //     assert.ok(!err);
  //     done();
  //   });
  // });
  // eslint-disable-next-line mocha/no-skipped-tests
  it.skip('version', function (done) {
    process.chdir(DATA_DIR);
    require(path.join(LIB, 'deploy', 'version'))([], {}, function (err) {
      assert.ok(!err);
      done();
    });
  });
});

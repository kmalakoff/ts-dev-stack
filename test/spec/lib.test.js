// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('path');
const spawn = require('cross-spawn-cb');

const data = require('../lib/data');

const devStack = require('ts-dev-stack');
const GITS = ['https://github.com/kmalakoff/fetch-http-message.git', 'https://github.com/kmalakoff/parser-multipart.git'];

const major = +process.versions.node.split('.')[0];

function addTests(git) {
  describe(path.basename(git, path.extname(git)), () => {
    let packagePath = null;
    before((cb) => {
      data(git, {}, (err, _packagePath) => {
        if (err) return cb(err);
        packagePath = _packagePath;
        process.chdir(packagePath); // TODO: get rid of this and figure out why it is needed
        cb();
      });
    });

    describe('happy path', () => {
      major < 14 ||
        it('build', (done) => {
          devStack.build([], { cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });

      it('test:engines', (done) => {
        spawn('npm', ['run', 'test:engines'], { stdio: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });

      if (major < 14) return;

      it('link', (done) => {
        devStack.link([], { cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });

      it('unlink', (done) => {
        devStack.unlink([], { cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });

      major < 14 ||
        it.skip('docs', (done) => {
          devStack.docs([], { cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });

      major < 14 ||
        it('coverage', (done) => {
          devStack.coverage([], { cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });

      // TODO: get deploy tests to work with 'no-publish'
      it.skip('deploy', (done) => {
        devStack.deploy([], { 'no-publish': true, cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });
      major < 14 ||
        it.skip('format', (done) => {
          devStack.format([], { cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });

      it('test', (done) => {
        devStack.test([], { cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });

      it('test:node', (done) => {
        devStack['test:node']([], { cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });

      major < 14 ||
        it('test:browser', (done) => {
          devStack['test:browser']([], { cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });

      it.skip('version', (done) => {
        devStack.deploy(['version'], { cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });
    });
  });
}

describe('lib', () => {
  for (let i = 0; i < GITS.length; i++) {
    addTests(GITS[i]);
  }
});

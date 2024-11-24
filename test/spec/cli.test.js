// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

const assert = require('assert');
const path = require('node:path');
const spawn = require('cross-spawn-cb');

const data = require('../lib/data');

const CLI = path.resolve(__dirname, '..', '..', 'bin', 'cli.js');
const GITS = ['https://github.com/kmalakoff/fetch-http-message.git'];

const major = +process.versions.node.split('.')[0];

function addTests(git) {
  describe(path.basename(git, path.extname(git)), () => {
    let packagePath = null;
    before((cb) => {
      data(git, {}, (err, _packagePath) => {
        if (err) return cb(err);
        packagePath = _packagePath;
        cb();
      });
    });

    describe('happy path', () => {
      major < 14 ||
        it('build', (done) => {
          spawn(CLI, ['build'], { stdout: 'inherit', cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });

      it('link', (done) => {
        spawn(CLI, ['link'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });

      it('unlink', (done) => {
        spawn(CLI, ['unlink'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });

      major < 14 ||
        it.skip('coverage', (done) => {
          spawn(CLI, ['coverage'], { stdout: 'inherit', cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });

      major < 14 ||
        it('format', (done) => {
          spawn(CLI, ['format'], { stdout: 'inherit', cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });

      it('test', (done) => {
        spawn(CLI, ['test'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });
      it('test:node', (done) => {
        spawn(CLI, ['test:node'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });
      it('test:browser', (done) => {
        spawn(CLI, ['test:browser'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err);
          done();
        });
      });

      // typedoc doesn't seem to take the parameters
      major < 14 ||
        it('docs', (done) => {
          spawn(CLI, ['docs'], { stdout: 'inherit', cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });
      major < 14 ||
        it('version', (done) => {
          spawn(CLI, ['version'], { encoding: 'utf8', cwd: packagePath }, (err) => {
            assert.ok(!err);
            done();
          });
        });
    });

    describe('unhappy path', () => {
      it('missing command', (done) => {
        spawn(CLI, [], { stdout: 'inherit' }, (err) => {
          assert.ok(!!err);
          done();
        });
      });
    });
  });
}

describe('cli', () => {
  for (let i = 0; i < GITS.length; i++) {
    addTests(GITS[i]);
  }
});

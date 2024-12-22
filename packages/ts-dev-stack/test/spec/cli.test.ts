// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import { data } from 'tsds-lib-test';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const CLI = path.resolve(__dirname, '..', '..', 'bin', 'cli.cjs');
const GITS = ['https://github.com/kmalakoff/fetch-http-message.git'];

function addTests(git) {
  describe(path.basename(git, path.extname(git)), () => {
    let packagePath = null;
    before((cb) => {
      data(git, { cwd: path.resolve(__dirname, '..', '..') }, (err, _packagePath) => {
        if (err) return cb(err);
        packagePath = _packagePath;
        cb();
      });
    });
    describe('happy path', () => {
      it('build', (done) => {
        spawn(CLI, ['build'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('link', (done) => {
        spawn(CLI, ['link'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('unlink', (done) => {
        spawn(CLI, ['unlink'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it.skip('coverage', (done) => {
        spawn(CLI, ['coverage'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('format', (done) => {
        spawn(CLI, ['format'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test:node', (done) => {
        spawn(CLI, ['test:node'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test:browser', (done) => {
        spawn(CLI, ['test:browser'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      // typedoc doesn't seem to take the parameters
      it('docs', (done) => {
        spawn(CLI, ['docs'], { stdout: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('version', (done) => {
        spawn(CLI, ['version'], { stdio: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
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

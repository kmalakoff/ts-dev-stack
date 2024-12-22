// remove NODE_OPTIONS from ts-dev-stack
// biome-ignore lint/performance/noDelete: <explanation>
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';

import * as devStack from 'ts-dev-stack';
import { data } from 'tsds-lib-test';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const GITS = ['https://github.com/kmalakoff/fetch-http-message.git', 'https://github.com/kmalakoff/parser-multipart.git'];
// const GITS = ['https://github.com/kmalakoff/fetch-http-message.git', 'https://github.com/kmalakoff/parser-multipart.git', 'https://github.com/kmalakoff/react-dom-event.git'];
// const GITS = ['https://github.com/kmalakoff/fetch-http-message.git'];
// const GITS = ['https://github.com/kmalakoff/react-dom-event.git'];
// const GITS = ['https://github.com/kmalakoff/react-native-event.git'];

function addTests(git) {
  describe(path.basename(git, path.extname(git)), () => {
    let packagePath = null;
    before((cb) => {
      data(git, { cwd: path.resolve(__dirname, '..', '..') }, (err, _packagePath) => {
        if (err) return cb(err);
        packagePath = _packagePath;
        process.chdir(packagePath); // TODO: get rid of this and figure out why it is needed
        cb();
      });
    });
    describe('happy path', () => {
      it('build', (done) => {
        devStack.build([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('link', (done) => {
        devStack.link([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('unlink', (done) => {
        devStack.unlink([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it.skip('coverage', (done) => {
        devStack.coverage([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('format', (done) => {
        devStack.format([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('prepublish', (done) => {
        devStack.prepublish([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test:node', (done) => {
        devStack.testNode([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test:browser', (done) => {
        devStack.testBrowser([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test:engines', (done) => {
        spawn('npm', ['run', 'test:engines'], { stdio: 'inherit', cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      // typedoc doesn't seem to take the parameters
      it('docs', (done) => {
        devStack.docs([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('version', (done) => {
        devStack.version([], { cwd: packagePath }, (err) => {
          assert.ok(!err, err ? err.message : '');
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

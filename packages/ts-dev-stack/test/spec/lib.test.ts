// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import os from 'os-shim';
import Queue from 'queue-cb';
import resolve from 'resolve';
import shortHash from 'short-hash';
import { installGitRepo, linkModule } from 'tsds-lib-test';

import { runCommand } from 'ts-dev-stack';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const GITS = ['https://github.com/kmalakoff/fetch-http-message.git', 'https://github.com/kmalakoff/parser-multipart.git', 'https://github.com/kmalakoff/react-dom-event.git'];
// const GITS = ['https://github.com/kmalakoff/parser-multipart.git'];

function addTests(repo) {
  const repoName = path.basename(repo, path.extname(repo));
  describe(repoName, () => {
    const dest = path.join(os.tmpdir(), 'ts-dev-stack', shortHash(process.cwd()), repoName);

    before((cb) => {
      const modulePath = fs.realpathSync(path.resolve(__dirname, '..', '..'));
      const modulePackage = JSON.parse(fs.readFileSync(path.join(modulePath, 'package.json'), 'utf8'));
      const nodeModules = path.join(dest, 'node_modules');
      const deps = { ...(modulePackage.dependencies || {}), ...(modulePackage.peerDependencies || {}) };

      installGitRepo(repo, dest, (err) => {
        if (err) return cb(err);

        const queue = new Queue();
        queue.defer(linkModule.bind(null, modulePath, nodeModules));
        for (const dep in deps) queue.defer(linkModule.bind(null, path.dirname(resolve.sync(`${dep}/package.json`)), nodeModules));
        queue.await((err) => {
          if (err) return cb(err);
          process.chdir(modulePath); // TODO: get rid of this and figure out why it is needed
          cb();
        });
      });
    });

    describe('happy path', () => {
      it('build', (done) => {
        runCommand('build', [], { cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('link', (done) => {
        runCommand('link', [], { cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('unlink', (done) => {
        runCommand('unlink', [], { cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('format', (done) => {
        runCommand('format', [], { cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('publish', (done) => {
        runCommand('prepublish', ['--dry-run'], { cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('prepublish', (done) => {
        runCommand('prepublish', [], { cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test', (done) => {
        spawn('npm', ['run', 'test'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test:engines', (done) => {
        spawn('npm', ['run', 'test:engines'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it.skip('coverage', (done) => {
        spawn('npm', ['run', 'coverage'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err && err.message.indexOf('Missing script"') < 0) assert.ok(err.message);
          done();
        });
      });
      it('docs', (done) => {
        runCommand('docs', [], { cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('version', (done) => {
        runCommand('version', [], { cwd: dest }, (err) => {
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

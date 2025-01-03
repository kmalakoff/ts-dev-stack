// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import url from 'url';
import spawn from 'cross-spawn-cb';
import { linkModule, unlinkModule } from 'module-link-unlink';
import os from 'os-shim';
import Queue from 'queue-cb';
import resolve from 'resolve';
import shortHash from 'short-hash';
import { installGitRepo } from 'tsds-lib-test';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const CLI = path.resolve(__dirname, '..', '..', 'bin', 'cli.cjs');
const GITS = ['https://github.com/kmalakoff/fetch-http-message.git'];

function addTests(repo) {
  const repoName = path.basename(repo, path.extname(repo));
  describe(repoName, () => {
    const dest = path.join(os.tmpdir(), 'ts-dev-stack', shortHash(process.cwd()), repoName);
    const modulePath = fs.realpathSync(path.resolve(__dirname, '..', '..'));
    const modulePackage = JSON.parse(fs.readFileSync(path.join(modulePath, 'package.json'), 'utf8'));
    const nodeModules = path.join(dest, 'node_modules');
    const deps = { ...(modulePackage.dependencies || {}), ...(modulePackage.peerDependencies || {}) };

    before((cb) => {
      installGitRepo(repo, dest, (err) => {
        if (err) return cb(err);

        const queue = new Queue();
        queue.defer(linkModule.bind(null, modulePath, nodeModules));
        for (const dep in deps) queue.defer(linkModule.bind(null, path.dirname(resolve.sync(`${dep}/package.json`)), nodeModules));
        queue.await(cb);
      });
    });
    after((cb) => {
      const queue = new Queue();
      queue.defer(unlinkModule.bind(null, modulePath, nodeModules));
      for (const dep in deps) queue.defer(unlinkModule.bind(null, path.dirname(resolve.sync(`${dep}/package.json`)), nodeModules));
      queue.await(cb);
    });

    describe('happy path', () => {
      it('build', (done) => {
        spawn(CLI, ['build', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('link', (done) => {
        spawn(CLI, ['link', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('unlink', (done) => {
        spawn(CLI, ['unlink', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('format', (done) => {
        spawn(CLI, ['format', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('publish', (done) => {
        spawn(CLI, ['publish', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test:node', (done) => {
        spawn(CLI, ['test:node', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('test:browser', (done) => {
        spawn(CLI, ['test:browser', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('coverage', (done) => {
        spawn(CLI, ['coverage', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('docs', (done) => {
        spawn(CLI, ['docs', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
      it('version', (done) => {
        spawn(CLI, ['version', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          assert.ok(!err, err ? err.message : '');
          done();
        });
      });
    });
    describe('unhappy path', () => {
      it('missing command', (done) => {
        spawn(CLI, [], { stdio: 'inherit' }, (err) => {
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

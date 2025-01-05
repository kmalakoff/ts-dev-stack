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

import { runCommand } from 'ts-dev-stack';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const GITS = ['https://github.com/kmalakoff/fetch-http-message.git', 'https://github.com/kmalakoff/parser-multipart.git', 'https://github.com/kmalakoff/react-dom-event.git'];
// const GITS = ['https://github.com/kmalakoff/parser-multipart.git'];

function addTests(repo) {
  const repoName = path.basename(repo, path.extname(repo));
  describe(repoName, () => {
    const dest = path.join(os.tmpdir(), 'ts-dev-stack', shortHash(process.cwd()), repoName);
    const modulePath = fs.realpathSync(path.join(__dirname, '..', '..'));
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
        runCommand('build', [], { cwd: dest }, (err) => {
          if (err) return done(err);
          done();
        });
      });
      it('link', (done) => {
        runCommand('link', [], { cwd: dest }, (err) => {
          if (err) return done(err);
          done();
        });
      });
      it('unlink', (done) => {
        runCommand('unlink', [], { cwd: dest }, (err) => {
          if (err) return done(err);
          done();
        });
      });
      it('format', (done) => {
        runCommand('format', [], { cwd: dest }, (err) => {
          if (err) return done(err);
          done();
        });
      });
      it('publish', (done) => {
        runCommand('publish', ['--dry-run'], { cwd: dest }, (err) => {
          if (err) return done(err);
          done();
        });
      });
      it('test', (done) => {
        spawn('npm', ['run', 'test'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);
          done();
        });
      });
      it('test:engines', (done) => {
        spawn('npm', ['run', 'test:engines'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);
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
          if (err) return done(err);
          done();
        });
      });
      it('validate', (done) => {
        runCommand('validate', ['--dry-run'], { cwd: dest }, (err) => {
          if (err) return done(err);
          done();
        });
      });
      it('version', (done) => {
        runCommand('version', ['--dry-run'], { cwd: dest }, (err) => {
          if (err) return done(err);
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

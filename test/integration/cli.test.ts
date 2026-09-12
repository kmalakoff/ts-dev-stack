// remove NODE_OPTIONS to not interfere with tests
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import spawn from 'cross-spawn-cb';
import fs from 'fs';
import { linkModule, unlinkModule } from 'module-link-unlink';
import path from 'path';
import Queue from 'queue-cb';
import * as resolve from 'resolve';
import shortHash from 'short-hash';
import { installGitRepo } from 'tsds-lib-test';
import url from 'url';

const resolveSync = (resolve.default ?? resolve).sync;

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const packageRoot = fs.realpathSync(path.join(__dirname, '..', '..'));

const CLI = path.join(__dirname, '..', '..', 'bin', 'cli.js');
const GITS = ['https://github.com/kmalakoff/fetch-http-message.git'];

function addTests(repo: string) {
  const repoName = path.basename(repo, path.extname(repo));
  describe(repoName, () => {
    const dest = path.join(packageRoot, '.tmp', 'cache', shortHash(process.cwd()), repoName);
    const modulePath = fs.realpathSync(path.join(__dirname, '..', '..'));
    const modulePackage = JSON.parse(fs.readFileSync(path.join(modulePath, 'package.json'), 'utf8'));
    const nodeModules = path.join(dest, 'node_modules');
    const deps = { ...(modulePackage.dependencies || {}), ...(modulePackage.peerDependencies || {}) };

    before((cb) => {
      installGitRepo(repo, dest, (err): void => {
        if (err) return cb(err);

        const queue = new Queue();
        queue.defer((cb) => linkModule(modulePath, nodeModules, (err) => cb(err)));
        for (const dep in deps) queue.defer((cb) => linkModule(path.dirname(resolveSync(`${dep}/package.json`)), nodeModules, (err) => cb(err)));
        queue.await(cb);
      });
    });
    after((cb) => {
      const queue = new Queue();
      queue.defer((cb) => unlinkModule(modulePath, nodeModules, (err) => cb(err)));
      for (const dep in deps) queue.defer((cb) => unlinkModule(path.dirname(resolveSync(`${dep}/package.json`)), nodeModules, (err) => cb(err)));
      queue.await(cb);
    });

    describe('happy path', () => {
      it('build', (done) => {
        spawn(CLI, ['build', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('install', (done) => {
        spawn(CLI, ['install', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('link', (done) => {
        spawn(CLI, ['link', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('unlink', (done) => {
        spawn(CLI, ['unlink', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('format', (done) => {
        spawn(CLI, ['format', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('publish', (done) => {
        spawn(CLI, ['publish', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('test:node', (done) => {
        spawn(CLI, ['test:node', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('test:browser', (done) => {
        spawn(CLI, ['test:browser', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('coverage', (done) => {
        spawn(CLI, ['coverage', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('docs', (done) => {
        spawn(CLI, ['docs', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('validate', (done) => {
        spawn(CLI, ['validate', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

          done();
        });
      });
      it('version', (done) => {
        spawn(CLI, ['version', '--dry-run'], { stdio: 'inherit', cwd: dest }, (err) => {
          if (err) return done(err);

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

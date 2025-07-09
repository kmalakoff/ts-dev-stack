// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import fs from 'fs';
import { linkModule, unlinkModule } from 'module-link-unlink';
import os from 'os';
import osShim from 'os-shim';
import path from 'path';
import Queue from 'queue-cb';
import * as resolve from 'resolve';
import shortHash from 'short-hash';
import { installGitRepo } from 'tsds-lib-test';
import url from 'url';

const tmpdir = os.tmpdir || osShim.tmpdir;
const resolveSync = (resolve.default ?? resolve).sync;

// @ts-ignore
import { hasChanged } from 'tsds-publish';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const GITS = ['https://github.com/kmalakoff/parser-multipart.git'];

function addTests(repo) {
  const repoName = path.basename(repo, path.extname(repo));
  describe(repoName, () => {
    const dest = path.join(tmpdir(), 'tsds-publish', shortHash(process.cwd()), repoName);
    const modulePath = fs.realpathSync(path.join(__dirname, '..', '..'));
    const modulePackage = JSON.parse(fs.readFileSync(path.join(modulePath, 'package.json'), 'utf8'));
    const nodeModules = path.join(dest, 'node_modules');
    const deps = { ...(modulePackage.dependencies || {}), ...(modulePackage.peerDependencies || {}) };

    before((cb) => {
      installGitRepo(repo, dest, (err): undefined => {
        if (err) {
          cb(err);
          return;
        }

        const queue = new Queue();
        queue.defer(linkModule.bind(null, modulePath, nodeModules));
        for (const dep in deps) queue.defer(linkModule.bind(null, path.dirname(resolveSync(`${dep}/package.json`)), nodeModules));
        queue.await(cb);
      });
    });
    after((cb) => {
      const queue = new Queue();
      queue.defer(unlinkModule.bind(null, modulePath, nodeModules));
      for (const dep in deps) queue.defer(unlinkModule.bind(null, path.dirname(resolveSync(`${dep}/package.json`)), nodeModules));
      queue.await(cb);
    });

    it('hasChanged', (done) => {
      hasChanged({ cwd: dest }, (err, changed): undefined => {
        if (err) {
          done(err.message);
          return;
        }
        assert.equal(typeof changed, 'boolean');
        done();
      });
    });
  });
}
describe('lib', () => {
  for (let i = 0; i < GITS.length; i++) {
    addTests(GITS[i]);
  }
});

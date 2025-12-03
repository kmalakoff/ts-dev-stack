// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import fs from 'fs';
import os from 'os';
import osShim from 'os-shim';
import path from 'path';
import shortHash from 'short-hash';
import url from 'url';

import { installGitRepo } from 'tsds-lib-test';

const tmpdir = os.tmpdir || osShim.tmpdir;

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

const REPO = 'https://github.com/kmalakoff/fetch-http-message.git';

describe('lib', () => {
  describe('installGitRepo', () => {
    const dest = path.join(tmpdir(), 'tsds-lib-test', shortHash(process.cwd()), 'fetch-http-message');

    it('should clone and install a git repo', (done) => {
      installGitRepo(REPO, dest, (err?: Error): undefined => {
        if (err) {
          done(err.message);
          return;
        }
        // Verify the repo was cloned
        assert.ok(fs.existsSync(path.join(dest, 'package.json')), 'package.json should exist');
        assert.ok(fs.existsSync(path.join(dest, '.git')), '.git should exist');
        assert.ok(fs.existsSync(path.join(dest, 'node_modules')), 'node_modules should exist');
        done();
      });
    });

    it('should reset existing repo on subsequent calls', (done) => {
      // Create a test file that should be removed on reset
      const testFile = path.join(dest, 'test-file-to-remove.txt');
      fs.writeFileSync(testFile, 'test');
      assert.ok(fs.existsSync(testFile), 'test file should exist before reset');

      installGitRepo(REPO, dest, (err?: Error): undefined => {
        if (err) {
          done(err.message);
          return;
        }
        // Test file should be removed by git clean
        assert.ok(!fs.existsSync(testFile), 'test file should be removed after reset');
        done();
      });
    });
  });
});

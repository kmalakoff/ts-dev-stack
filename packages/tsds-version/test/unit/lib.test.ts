// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import os from 'os';
import osShim from 'os-shim';
import path from 'path';
import * as resolve from 'resolve';
import url from 'url';

const _tmpdir = os.tmpdir || osShim.tmpdir;
const _resolveSync = (resolve.default ?? resolve).sync;

// Note: tsds-version runs gh-pages which would publish docs
// We test that the module loads and exports correctly
// Actual execution is tested via ts-dev-stack CLI with --dry-run
import version from 'tsds-version';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));

describe('lib', () => {
  describe('module', () => {
    it('exports a function', () => {
      assert.equal(typeof version, 'function');
    });
  });

  // Note: We skip actual execution tests because tsds-version runs gh-pages
  // which would publish documentation to GitHub Pages.
  // The ts-dev-stack CLI tests this command with --dry-run flag.
});

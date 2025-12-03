// remove NODE_OPTIONS from ts-dev-stack
delete process.env.NODE_OPTIONS;

import assert from 'assert';
import fs from 'fs';
import path from 'path';
import url from 'url';

import { installPath, loadConfig } from 'tsds-lib';

const __dirname = path.dirname(typeof __filename !== 'undefined' ? __filename : url.fileURLToPath(import.meta.url));
const packagePath = path.join(__dirname, '..', '..');

describe('lib', () => {
  describe('loadConfig', () => {
    it('should load tsds config from package.json', () => {
      const config = loadConfig({ cwd: packagePath });
      assert.ok(config, 'config should exist');
      assert.equal(config.source, 'src/index.ts');
    });

    it('should return null for directory without package.json', () => {
      const config = loadConfig({ cwd: '/tmp' });
      assert.equal(config, null);
    });

    it('should use provided config option', () => {
      const providedConfig = { source: 'custom/index.ts' };
      const config = loadConfig({ config: providedConfig });
      assert.deepEqual(config, providedConfig);
    });
  });

  describe('installPath', () => {
    it('should return node_modules path for package', () => {
      const result = installPath({ cwd: packagePath });
      const pkg = JSON.parse(fs.readFileSync(path.join(packagePath, 'package.json'), 'utf8'));
      assert.equal(result, path.join(packagePath, 'node_modules', pkg.name));
    });

    it('should use provided installPath option', () => {
      const customPath = '/custom/install/path';
      const result = installPath({ installPath: customPath });
      assert.equal(result, customPath);
    });
  });
});

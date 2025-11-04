import crypto from 'crypto';
import fs from 'fs';
import Module from 'module';
import type { Packument } from 'pacote';
import path from 'path';
import { type CommandOptions, wrapWorker } from 'tsds-lib';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..', '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'lib', 'hasChanged.js'));

import type { HasChangedCallback } from '../types.ts';

function worker(options: CommandOptions, callback: HasChangedCallback): undefined {
  const cwd: string = (options.cwd as string) || process.cwd();
  options = { ...options };
  options.package = options.package || JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  (async () => {
    try {
      const Arborist = _require('@npmcli/arborist');
      const npa = _require('npm-package-arg');
      const pacote = _require('pacote');
      const { execFile } = _require('child_process');
      const { promisify } = _require('util');
      const execFileAsync = promisify(execFile);

      // Get registry URL for scoped package from npm config
      let registry: string | undefined;
      const scope = options.package.name.startsWith('@') ? options.package.name.split('/')[0] : undefined;
      if (scope) {
        try {
          const { stdout } = await execFileAsync('npm', ['config', 'get', `${scope}:registry`]);
          registry = stdout.trim();
          if (registry === 'undefined') registry = undefined;
        } catch (_err) {
          // Fallback to default registry if scope registry not found
        }
      }

      // Use pacote.packument() with explicit registry to respect scoped package configuration
      const packument: Packument = await pacote.packument(options.package.name, {
        Arborist,
        ...(registry && { registry }),
      });

      // Get latest version from registry
      const latestVersion = packument['dist-tags'].latest;
      const integrity = packument.versions[latestVersion].dist.integrity;

      // Temporarily modify package.json to match registry latest
      // This allows us to compare same-version tarballs (only code differs)
      const pkgPath = path.join(cwd, 'package.json');
      const originalPkg = fs.readFileSync(pkgPath, 'utf8');
      const pkg = JSON.parse(originalPkg);
      pkg.version = latestVersion;
      fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2));

      try {
        // Build tarball with modified version
        const spec = npa(cwd);
        const manifest = await pacote.manifest(spec, {
          Arborist,
        });
        const tarball = await pacote.tarball(manifest._resolved, {
          Arborist,
          integrity: manifest._integrity,
        });

        // Compare hashes
        const parts = integrity.split('-');
        const algorithm = parts.shift();
        const registryHash = parts.join('-');
        const local = crypto.createHash(algorithm).update(new Uint8Array(tarball)).digest('base64');
        callback(null, registryHash !== local);
      } finally {
        // Always restore original package.json
        fs.writeFileSync(pkgPath, originalPkg);
      }
    } catch (_err) {
      callback(null, true);
    }
  })().catch(callback);
}

export default function hasChanged(options: CommandOptions, callback: HasChangedCallback): undefined {
  version !== 'local' ? workerWrapper(version, options, callback) : worker(options, callback);
}

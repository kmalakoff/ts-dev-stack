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

      // FIRST CHECK: Version comparison
      // If versions differ, assume intentional bump → force publish
      if (options.package.version !== latestVersion) {
        callback(null, {
          changed: true,
          reason: `Version differs (local: ${options.package.version}, registry: ${latestVersion})`,
        });
        return;
      }

      // SECOND CHECK: Integrity comparison (only if versions match)
      const integrity = packument.versions[latestVersion].dist.integrity;

      // Build tarball with current version (no modification needed)
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

      if (registryHash === local) {
        callback(null, {
          changed: false,
          reason: `No changes detected (hash: ${registryHash.substring(0, 16)}...)`,
        });
      } else {
        callback(null, {
          changed: true,
          reason: `Code changes detected (registry: ${registryHash.substring(0, 16)}..., local: ${local.substring(0, 16)}...)`,
        });
      }
    } catch (_err) {
      // Package not found in registry (first publish)
      if (_err.code === 'E404') {
        callback(null, { changed: true, reason: 'Package not found in registry (first publish)' });
      } else {
        // Unknown error - assume changed to be safe
        callback(null, { changed: true, reason: `Error checking changes: ${_err.message}` });
      }
    }
  })().catch(callback);
}

export default function hasChanged(options: CommandOptions, callback: HasChangedCallback): undefined {
  version !== 'local' ? workerWrapper(version, options, callback) : worker(options, callback);
}

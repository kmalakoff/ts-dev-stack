import crypto from 'crypto';
import fs from 'fs';
import get from 'get-remote';
import Module from 'module';
import path from 'path';
import { type CommandOptions, wrapWorker } from 'tsds-lib';
import url from 'url';

const major = +process.versions.node.split('.')[0];
const version = major > 14 ? 'local' : 'stable';
const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const dist = path.join(__dirname, '..', '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'lib', 'hasChanged.js'));

interface DistTag {
  latest: string;
}

interface Registry {
  versions: object;
  'dist-tags': DistTag;
}

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
      const res = await get(`https://registry.npmjs.org/${options.package.name}`).json();
      const integrity = (res.body as Registry).versions[(res.body['dist-tags'] as DistTag).latest].dist.integrity;
      const spec = npa(cwd);
      const manifest = await pacote.manifest(spec, {
        Arborist,
      });
      const tarball = await pacote.tarball(manifest._resolved, {
        Arborist,
        integrity: manifest._integrity,
      });
      const parts = integrity.split('-');
      const algorithm = parts.shift();
      const latest = parts.join('-');
      const local = crypto.createHash(algorithm).update(new Uint8Array(tarball)).digest('base64');
      callback(null, latest !== local);
    } catch (_err) {
      callback(null, true);
    }
  })().catch(callback);
}

export default function hasChanged(options: CommandOptions, callback: HasChangedCallback): undefined {
  version !== 'local' ? workerWrapper(version, options, callback) : worker(options, callback);
}

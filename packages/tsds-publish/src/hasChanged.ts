import crypto from 'crypto';
import fs from 'fs';
import Module from 'module';
import path from 'path';
import url from 'url';
import Arborist from '@npmcli/arborist';
import get from 'get-remote';
import npa from 'npm-package-arg';
import pacote from 'pacote';
import { wrapWorker } from 'tsds-lib';

interface DistTag {
  latest: string;
}

interface Registry {
  versions: object;
  'dist-tags': DistTag;
}

const _require = typeof require === 'undefined' ? Module.createRequire(import.meta.url) : require;
const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const version = major > 0 ? 'local' : 'stable';
const dist = path.join(__dirname, '..', '..');
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'hasChanged.cjs'));

async function worker(options, callback) {
  const cwd = options.cwd || process.cwd();
  options = { ...options };
  options.package = options.package || JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));

  try {
    const res = await get(`https://registry.npmjs.org/${options.package.name}`).json();
    const integrity = (res.body as Registry).versions[(res.body as Registry)['dist-tags'].latest].dist.integrity;
    const spec = npa(cwd);
    const manifest = await pacote.manifest(spec, { Arborist });
    const tarball = await pacote.tarball(manifest._resolved, { Arborist, integrity: manifest._integrity });
    const parts = integrity.split('-');
    const algorithm = parts.shift();
    const latest = parts.join('-');
    const local = crypto.createHash(algorithm).update(new Uint8Array(tarball)).digest('base64');
    callback(null, latest !== local);
  } catch (err) {
    callback(err, true);
  }
}

export default function hasChanged(options, callback) {
  major < 14 ? workerWrapper(version, options, callback) : worker(options, callback);
}

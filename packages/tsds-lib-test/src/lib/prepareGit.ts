import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn-cb';
import access from 'fs-access-compat';
import mkdirp from 'mkdirp';
import os from 'os-shim';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import shortHash from 'short-hash';

// @ts-ignore
import process from './process.cjs';

export default function prepareGit(git, options, callback) {
  const cwd = options.cwd || process.cwd();
  const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
  const dest = path.join(os.tmpdir(), pkg.name, shortHash(cwd));
  const targetName = path.basename(git, path.extname(git));
  const targetPath = path.join(dest, targetName);
  mkdirp.sync(dest);

  access(targetPath, (err) => {
    if (!err && options.clean) {
      rimraf2.sync(targetPath, { disableGlob: true });
      err = true;
    }

    const queue = new Queue(1);
    // does not exist - clone
    if (err) {
      queue.defer(spawn.bind(null, 'git', ['clone', git], { stdio: 'inherit', cwd: dest }));
    }
    // exists - reset git
    else {
      queue.defer(spawn.bind(null, 'git', ['clean', '-fd'], { stdio: 'inherit', cwd: targetPath }));
      queue.defer(spawn.bind(null, 'git', ['reset', '--hard', 'HEAD'], { stdio: 'inherit', cwd: targetPath }));
      queue.defer(spawn.bind(null, 'git', ['pull', '--rebase'], { stdio: 'inherit', cwd: targetPath }));
    }

    queue.await(callback);
  });
}

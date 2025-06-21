import spawn from 'cross-spawn-cb';
import fs from 'fs';
import mkdirp from 'mkdirp-classic';
import path from 'path';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';
import type { CommandCallback, CommandOptions } from 'tsds-lib';
import { wrapWorker } from 'tsds-lib';
import url from 'url';
import type { InstallOptions } from '../types.ts';

const __dirname = path.dirname(typeof __filename === 'undefined' ? url.fileURLToPath(import.meta.url) : __filename);
const major = +process.versions.node.split('.')[0];
const dist = path.join(__dirname, '..', '..');
const version = major > 0 ? 'local' : 'stable';
const workerWrapper = wrapWorker(path.join(dist, 'cjs', 'lib', 'installGitRepo.js'));

function worker(repo, dest, options: CommandOptions | InstallOptions, callback: CommandCallback) {
  const installOptions = options as InstallOptions;
  // options.clean = true;
  function checkOrClean(dest, callback) {
    installOptions.clean ? rimraf2(dest, { disableGlob: true }, callback.bind(null, new Error('clone'))) : fs.stat(dest, callback);
  }

  checkOrClean(dest, (err) => {
    const queue = new Queue(1);
    queue.defer(mkdirp.bind(null, dest));

    // does not exist - clone
    if (err) {
      queue.defer(spawn.bind(null, 'git', ['clone', repo, path.basename(dest)], { cwd: path.dirname(dest), stdio: 'inherit' }));
    }
    // exists - reset git
    else {
      queue.defer(spawn.bind(null, 'git', ['clean', '-fd'], { cwd: dest, stdio: 'inherit' }));
      queue.defer(spawn.bind(null, 'git', ['reset', '--hard', 'HEAD'], { cwd: dest, stdio: 'inherit' }));
      queue.defer(spawn.bind(null, 'git', ['pull', '--rebase'], { cwd: dest, stdio: 'inherit' }));
    }

    queue.defer(spawn.bind(null, 'npm', ['install', '--silent'], { cwd: dest }));
    queue.await(callback);
  });
}

export default function installGitRepo(repo: string, dest: string, options: CommandOptions | CommandCallback, callback?: CommandCallback): undefined {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  version !== 'local' ? workerWrapper(version, repo, dest, options, callback) : worker(repo, dest, options, callback);
}

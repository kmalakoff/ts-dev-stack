import path from 'path';
import spawn from 'cross-spawn-cb';
import access from 'fs-access-compat';
import mkdirp from 'mkdirp-classic';
import Queue from 'queue-cb';
import rimraf2 from 'rimraf2';

export default function installGitRepo(repo: string, dest: string, options, callback?) {
  if (typeof options === 'function') {
    callback = options;
    options = {};
  }
  options = options || {};
  console.log('installGitRepo', repo, dest);
  // options.clean = true;

  function checkOrClean(dest, callback) {
    options.clean ? rimraf2(dest, { disableGlob: true }, callback.bind(null, new Error('clone'))) : access(dest, callback);
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

    // npm ci - not working due to binary incompatibilities - install without lockfile - https://github.com/npm/cli/issues/4828#issuecomment-2514987829
    queue.defer(spawn.bind(null, 'git', ['checkout', 'master', '--', 'package-lock.json'], { cwd: dest, stdio: 'inherit' }));
    queue.defer(spawn.bind(null, 'npm', ['install'], { cwd: dest }));

    queue.await(callback);
  });
}

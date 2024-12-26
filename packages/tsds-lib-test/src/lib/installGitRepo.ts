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
  // options.clean = true;

  function checkOrClean(dest, callback) {
    options.clean ? rimraf2(dest, { disableGlob: true }, callback.bind(null, new Error('clone'))) : access(dest, callback);
  }

  checkOrClean(dest, (err) => {
    const queue = new Queue(1);
    queue.defer(mkdirp.bind(null, dest));

    // does not exist - clone
    if (err) {
      queue.defer(spawn.bind(null, 'git', ['clone', repo, path.basename(dest)], { stdio: 'inherit', cwd: path.dirname(dest) }));
    }
    // exists - reset git
    else {
      queue.defer(spawn.bind(null, 'git', ['clean', '-fd'], { stdio: 'inherit', cwd: dest }));
      queue.defer(spawn.bind(null, 'git', ['reset', '--hard', 'HEAD'], { stdio: 'inherit', cwd: dest }));
      queue.defer(spawn.bind(null, 'git', ['pull', '--rebase'], { stdio: 'inherit', cwd: dest }));
    }

    // install
    queue.defer(spawn.bind(null, 'npm', ['--silent', 'install'], { cwd: dest }));

    queue.await(callback);
  });
}

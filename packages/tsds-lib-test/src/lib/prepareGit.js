const path = require('path');
const Queue = require('queue-cb');
const spawn = require('cross-spawn-cb');
const access = require('fs-access-compat');
const rimraf2 = require('rimraf2');
const tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
const mkdirp = require('mkdirp');
const shortHash = require('short-hash');

module.exports = function prepareGit(git, options, callback) {
  const cwd = options.cwd || process.cwd();
  const pkg = require(path.join(cwd, 'package.json'));
  const dest = path.join(tmpdir(), pkg.name, shortHash(cwd));
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

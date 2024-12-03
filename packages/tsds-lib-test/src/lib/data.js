const fs = require('fs');
const path = require('path');
const Queue = require('queue-cb');
const spawn = require('cross-spawn-cb');
const tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
const mkdirp = require('mkdirp');
const shortHash = require('short-hash');

const prepareGit = require('./prepareGit');

module.exports = function data(git, options, callback) {
  const cwd = options.cwd || process.cwd();
  const pkg = require(path.join(cwd, 'package.json'));
  const dest = path.join(tmpdir(), pkg.name, shortHash(cwd));
  const targetName = path.basename(git, path.extname(git));
  const targetPath = path.join(dest, targetName);
  mkdirp.sync(dest);

  const queue = new Queue(1);
  for (const binName in pkg.bin) {
    const packagePath = path.resolve(targetPath, 'node_modules', pkg.name);
    const binPath = path.resolve(targetPath, 'node_modules', '.bin', binName);

    console.log('------------------');
    console.log(`Preparing: ${targetPath}`);

    // clone or reset the git repo
    queue.defer(prepareGit.bind(null, git, options));

    // install
    queue.defer(spawn.bind(null, 'nvu', ['lts', '--silent', 'npm', 'install'], { stdio: 'inherit', cwd: targetPath }));

    // link package
    queue.defer(fs.rename.bind(null, packagePath, `${packagePath}.tsds`));
    queue.defer(fs.symlink.bind(null, cwd, packagePath, 'dir'));

    // link bin
    queue.defer(fs.rename.bind(null, binPath, `${binPath}.tsds`));
    queue.defer(fs.symlink.bind(null, path.resolve.apply(null, [cwd].concat(pkg.bin[binName].split('/'))), binPath, 'file'));

    queue.await((err) => {
      console.log('------------------');
      err ? callback(err) : callback(null, targetPath);
    });
  }
};

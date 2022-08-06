var fs = require('fs');
var path = require('path');
var Queue = require('queue-cb');
var spawn = require('cross-spawn-cb');
var access = require('fs-access-compat');

const tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
var mkdirp = require('mkdirp');
var rimraf = require('rimraf');
var shortHash = require('short-hash');

var dest = path.join(tmpdir(), 'tsds', shortHash(__dirname));
mkdirp.sync(dest);

module.exports = function data(git, options, callback) {
  var packageName = path.basename(git, path.extname(git));
  var packagePath = path.join(dest, packageName);
  var tsdsPackagePath = path.resolve(packagePath, 'node_modules', 'ts-dev-stack');
  var tsdsBinPath = path.resolve(packagePath, 'node_modules', '.bin', 'tsds');

  console.log('------------------');
  console.log('Preparing: ' + packagePath);

  access(packagePath, function (err) {
    var queue = new Queue(1);

    if (!err && options.clean) {
      rimraf.sync(packagePath);
      err = true;
    }

    // does not exist - clone
    if (err) {
      queue.defer(spawn.bind(null, 'git', ['clone', git], { stdio: 'inherit', cwd: dest }));
    }
    // exists - reset git
    else {
      queue.defer(spawn.bind(null, 'git', ['clean', '-fd'], { stdio: 'inherit', cwd: packagePath }));
      queue.defer(spawn.bind(null, 'git', ['reset', '--hard', 'HEAD'], { stdio: 'inherit', cwd: packagePath }));
      queue.defer(spawn.bind(null, 'git', ['pull', '--rebase'], { stdio: 'inherit', cwd: packagePath }));
    }
    queue.defer(spawn.bind(null, 'nvu', ['lts', '--silent', 'npm', 'install'], { stdio: 'inherit', cwd: packagePath }));

    // link package
    queue.defer(fs.rename.bind(null, tsdsPackagePath, tsdsPackagePath + '.tsds'));

    // link bin
    queue.defer(fs.rename.bind(null, tsdsBinPath, tsdsBinPath + '.tsds'));
    queue.defer(fs.symlink.bind(null, path.resolve(__dirname, '..', '..', 'bin', 'ts-dev-stack.js'), tsdsBinPath, 'file'));

    queue.await(function (err) {
      console.log('------------------');
      err ? callback(err) : callback(null, packagePath);
    });
  });
};

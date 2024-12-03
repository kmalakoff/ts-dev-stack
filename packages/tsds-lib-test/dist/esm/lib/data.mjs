const fs = require('fs');
const path = require('path');
const Queue = require('queue-cb');
const spawn = require('cross-spawn-cb');
const access = require('fs-access-compat');
const tmpdir = require('os').tmpdir || require('os-shim').tmpdir;
const mkdirp = require('mkdirp');
const rimraf2 = require('rimraf2');
const shortHash = require('short-hash');
const dest = path.join(tmpdir(), 'tsds', shortHash(__dirname));
mkdirp.sync(dest);
module.exports = function data(git, options, callback) {
    const packageName = path.basename(git, path.extname(git));
    const packagePath = path.join(dest, packageName);
    const tsdsPackagePath = path.resolve(packagePath, 'node_modules', 'ts-dev-stack');
    const tsdsBinPath = path.resolve(packagePath, 'node_modules', '.bin', 'tsds');
    // return callback(null, packagePath);
    console.log('------------------');
    console.log(`Preparing: ${packagePath}`);
    access(packagePath, (err)=>{
        const queue = new Queue(1);
        if (!err && options.clean) {
            rimraf2.sync(packagePath, {
                disableGlob: true
            });
            err = true;
        }
        // does not exist - clone
        if (err) {
            queue.defer(spawn.bind(null, 'git', [
                'clone',
                git
            ], {
                stdio: 'inherit',
                cwd: dest
            }));
        } else {
            queue.defer(spawn.bind(null, 'git', [
                'clean',
                '-fd'
            ], {
                stdio: 'inherit',
                cwd: packagePath
            }));
            queue.defer(spawn.bind(null, 'git', [
                'reset',
                '--hard',
                'HEAD'
            ], {
                stdio: 'inherit',
                cwd: packagePath
            }));
            queue.defer(spawn.bind(null, 'git', [
                'pull',
                '--rebase'
            ], {
                stdio: 'inherit',
                cwd: packagePath
            }));
        }
        queue.defer(spawn.bind(null, 'nvu', [
            'lts',
            '--silent',
            'npm',
            'install'
        ], {
            stdio: 'inherit',
            cwd: packagePath
        }));
        // link package
        queue.defer(fs.rename.bind(null, tsdsPackagePath, `${tsdsPackagePath}.tsds`));
        queue.defer(fs.symlink.bind(null, path.resolve(__dirname, '..', '..'), tsdsPackagePath, 'dir'));
        // link bin
        queue.defer(fs.rename.bind(null, tsdsBinPath, `${tsdsBinPath}.tsds`));
        queue.defer(fs.symlink.bind(null, path.resolve(__dirname, '..', '..', 'bin', 'cli.js'), tsdsBinPath, 'file'));
        queue.await((err)=>{
            console.log('------------------');
            err ? callback(err) : callback(null, packagePath);
        });
    });
};

import fs from 'fs';
import path from 'path';
import spawn from 'cross-spawn-cb';
import mkdirp from 'mkdirp';
import { tmpdir } from 'os-shim';
import Queue from 'queue-cb';
import shortHash from 'short-hash';
import prepareGit from './prepareGit.mjs';
export default function data(git, options, callback) {
    const cwd = options.cwd || process.cwd();
    const pkg = JSON.parse(fs.readFileSync(path.join(cwd, 'package.json'), 'utf8'));
    const dest = path.join(tmpdir(), pkg.name, shortHash(cwd));
    const targetName = path.basename(git, path.extname(git));
    const targetPath = path.join(dest, targetName);
    mkdirp.sync(dest);
    const queue = new Queue(1);
    for(const binName in pkg.bin){
        const packagePath = path.resolve(targetPath, 'node_modules', pkg.name);
        const binPath = path.resolve(targetPath, 'node_modules', '.bin', binName);
        console.log('------------------');
        console.log(`Preparing: ${targetPath}`);
        // clone or reset the git repo
        queue.defer(prepareGit.bind(null, git, options));
        // install
        queue.defer(spawn.bind(null, 'nvu', [
            'lts',
            '--silent',
            'npm',
            'install'
        ], {
            stdio: 'inherit',
            cwd: targetPath
        }));
        // link package
        queue.defer(fs.rename.bind(null, packagePath, `${packagePath}.tsds`));
        queue.defer(fs.symlink.bind(null, cwd, packagePath, 'dir'));
        // link bin
        queue.defer(fs.rename.bind(null, binPath, `${binPath}.tsds`));
        queue.defer(fs.symlink.bind(null, path.resolve.apply(null, [
            cwd
        ].concat(pkg.bin[binName].split('/'))), binPath, 'file'));
        queue.await((err)=>{
            console.log('------------------');
            err ? callback(err) : callback(null, targetPath);
        });
    }
}

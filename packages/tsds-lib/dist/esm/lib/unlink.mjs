import fs from 'fs';
import path from 'path';
import Queue from 'queue-cb';
export default function unlink(target, cb) {
    const movedPath = path.join(path.dirname(target), `${path.basename(target)}.tsds`);
    const queue = new Queue(1);
    queue.defer(fs.unlink.bind(null, target));
    queue.defer(fs.rename.bind(null, movedPath, target));
    queue.await(()=>{
        cb();
    });
}

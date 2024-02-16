const path = require('path');
const fs = require('fs');
const Queue = require('queue-cb');
function removeLink(installPath, cb) {
    fs.unlink(installPath, cb);
}
module.exports = function unlink(installPath, cb) {
    const movedPath = path.join(path.dirname(installPath), `${path.basename(installPath)}.tsds`);
    const queue = new Queue(1);
    queue.defer(removeLink.bind(null, installPath));
    queue.defer(fs.rename.bind(null, movedPath, installPath));
    queue.await(()=>{
        cb();
    });
};

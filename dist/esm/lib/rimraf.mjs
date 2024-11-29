import fs from 'fs';
import Iterator from 'fs-iterator';
export default function rimraf2(dir, callback) {
    const iterator = new Iterator(dir);
    iterator.forEach((entry, callback)=>{
        if (entry.stats.isDirectory()) return fs.rimraf2(entry.fullPath, callback);
        fs.unlink(entry.fullPath, callback);
    }, {
        callbacks: true
    }, callback);
}

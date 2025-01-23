import { Writable } from 'readable-stream';
export default function concatWritable(callback) {
    const chunks = [];
    const stream = new Writable({
        write: (chunk, _encoding, next)=>{
            chunks.push(chunk);
            next();
        }
    });
    stream.on('finish', ()=>callback(Buffer.concat(chunks.splice(0))));
    return stream;
}

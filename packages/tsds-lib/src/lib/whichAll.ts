import Queue from 'queue-cb';
import which from './which.js';

export default function whichAll(names, options, callback) {
  const results = {};
  const queue = new Queue();
  names.forEach((name) => {
    queue.defer((cb) =>
      which(name, options, (err, result) => {
        if (err) return cb(err);
        results[name] = result;
        cb();
      })
    );
  });
  queue.await((err) => {
    if (err) return callback(err);
    callback(
      null,
      names.map((name) => results[name])
    );
  });
}

// import path from 'path';
// import Queue from 'queue-cb';

// import rimraf2 from 'rimraf2';
// import { binPath, installPath, link, spawn, optionsToArgs } from 'tsds-lib';
// import requireResolve from 'resolve/sync';

// const major = typeof process === undefined ? Infinity : +process.versions.node.split('.')[0];
// const c8 = binPath(requireResolve('c8/package.json', { basedir: __dirname }), 'c8');
// const mocha = major < 12 ? binPath(requireResolve('mocha-compat/package.json', { basedir: __dirname }), '_mocha-compat') : binPath(requireResolve('mocha/package.json', { basedir: __dirname }), '_mocha');

// export default function c8(_args, options, cb) {
//   const cwd = options.cwd || process.cwd();

//   link(installPath(options), (err, restore) => {
//     if (err) return cb(err);

//     const queue = new Queue(1);
//     queue.defer((cb) => {
//       rimraf2(path.resolve(process.cwd(), { disableGlob: true }, 'coverage'), () => {
//         cb();
//       });
//     });
//     queue.defer((cb) => {
//       let args = [c8, '--config', path.join(__dirname, '..', '..', '..', 'assets', 'c8rc.json')];
//       args = args.concat([mocha, '--watch-extensions', 'ts,tsx']);
//       args = args.concat(optionsToArgs(options));
//       args = args.concat(_args.length ? _args.slice(-1) : ['test/**/*.test.*']);
//       spawn('ts-swc', args, { cwd }, cb);
//     });
//     queue.await((err) => {
//       restore((err2) => {
//         cb(err || err2);
//       });
//     });
//   });
// }

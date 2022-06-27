// var path = require('path');
// var fs = require('fs');
// var Queue = require('queue-cb');
// var swc = require('@swc/core');
// var once = require('call-once-fn');
// var assign = require('just-extend');
// var esbuild = require('esbuild');
// var mkdirp = require('mkdirp');

// // TODO: get working
// module.exports = function compileFile(entry, options, callback) {
//   var swcConfig = assign({}, options.baseConfig, {
//     filename: entry.basename,
//     module: { type: options.type, globals: options.globals },
//     sourceMaps: options.sourceMaps,
//     isModule: true,
//   });
//   swcConfig.jsc.target = 'es3';
//   var tmp = path.join(options.dist, 'index.js');

//   var queue = new Queue(1);
//   queue.defer(function (callback) {
//     callback = once(callback);
//     swc
//       .bundle({ entry: entry.fullPath })
//       .then((output) => {
//         output = output[path.basename(entry.fullPath)];
//         output.code = output.code.replace('exports.default =', 'module.exports =');
//         mkdirp(options.dist, function () {
//           fs.writeFile(tmp, output.code, 'utf8', cb);
//         });
//       })
//       .catch(callback);
//   });

//   queue.defer(function (callback) {
//     fs.readFile(tmp, 'utf8', function (err, contents) {
//       if (err) return callback(err);
//       callback = once(callback);
//       swc
//         .transform(contents, swcConfig)
//         .then((output) => {
//           var relname = entry.path.replace(/\.[^/.]+$/, '');
//           var ext = options.type === 'es6' ? '.mjs' : '.js';

//           esbuild
//             .transform(output.code, { minify: true, sourcemap: true })
//             .then(function (min) {
//               var map = JSON.parse(output.map);
//               map.sources = map.sources.map((x) => x.split('/').pop());

//               mkdirp(path.dirname(path.join(options.dist, relname + ext)), function () {
//                 var outQueue = new Queue();
//                     outQueue.defer(fs.writeFile.bind(null, path.join(options.dist, relname + ext), output.code, 'utf8'));
//                     !options.sourceMaps || outQueue.defer(fs.writeFile.bind(null, path.join(options.dist, relname + ext + '.map'), JSON.stringify(map), 'utf8'));
//               outQueue.defer(fs.writeFile.bind(null, path.join(options.dist, relname + '.min' + ext), min.code, 'utf8'));
//               !options.sourceMaps || outQueue.defer(fs.writeFile.bind(null, path.join(options.dist, relname + '.min' + ext + '.map'), min.map, 'utf8'));
//               outQueue.await(callback);
//             });
//           })
//             .catch(callback);
//         })
//         .catch(callback);
//     });
//   });
//   queue.defer(fs.unlink.bind(null, tmp));
//   queue.await(callback);
// };

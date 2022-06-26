var externals = require("rollup-plugin-node-externals");
var resolve = require("@rollup/plugin-node-resolve").default;
var { babel } = require("@rollup/plugin-babel");
var typescript = require('@rollup/plugin-typescript');
var { terser } = require("rollup-plugin-terser");
var camelcase = require("lodash.camelcase");

var path = require("path");
var fs = require("fs");
var pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json"), "utf8"));
var extensions = require("../../../lib/extensions");

module.exports = {
  output: [
    {
      file: path.resolve(process.cwd(), "dist", "umd", `${pkg.name}.js`),
      format: "umd",
      sourcemap: true,
      name: camelcase(pkg.name),
    },
    {
      file: path.resolve(process.cwd(), "dist", "umd", `${pkg.name}.min.js`),
      format: "umd",
      sourcemap: true,
      name: camelcase(pkg.name),
      plugins: [terser()],
    },
  ],
  plugins: [
    externals({ deps: true }),
    resolve({ extensions }),
    typescript({target: "es5"}),
    babel({ babelHelpers: "bundled", include: ["src/**/*.*"], extensions, exclude: "./node_modules/**" }),
  ],
};

"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = blobToString;

// https://stackoverflow.com/a/23024613/3150390

/* c8 ignore start */
function blobToString(b) {
  var u = URL.createObjectURL(b);
  var x = new XMLHttpRequest();
  x.open("GET", u, false);
  x.send();
  URL.revokeObjectURL(u);
  return x.responseText;
}
/* c8 ignore stop */


module.exports = exports.default;
//# sourceMappingURL=blobToString.js.map
/* eslint-disable @typescript-eslint/no-var-requires */

function polyfill() {
  if (typeof Buffer !== 'undefined' && !Buffer.alloc) {
    Buffer.alloc = function alloc(length, data) {
      let buffer = data;
      while (--length > 0) buffer += data;
      return new Buffer(buffer);
    };
  }
}
polyfill();

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.fetchHttpMessage = factory());
})(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];

    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;

        var F = function () {};

        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }

      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }

    var normalCompletion = true,
        didErr = false,
        err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }

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

  var hasHeaders = typeof Headers !== "undefined";
  var hasBlob = typeof Blob !== "undefined";
  var hasBuffer = typeof Buffer !== "undefined";
  var hasURLSearchParams = typeof URLSearchParams !== "undefined"; // export type RequestRedirect = 'error' | 'follow' | 'manual';

  function isRequest(object) {
    return _typeof(object) === "object";
  }
  /**
   * Generate an http message string using the fetch API
   *
   * @param input Fetch input
   * @param init Fetch init
   * @returns The http message string
   */


  function fetchHttpMessage(input, init) {
    if (input === undefined) throw new Error("Input is expected");
    if (init === undefined) init = {};
    var url;
    if (isRequest(input)) url = input.url;else {
      url = input;
      input = {};
    }
    var method = init.method || input.method || "GET";
    method = method.toUpperCase();
    var lines = ["".concat(method, " ").concat(url, " HTTP/1.1")];
    var headers = init.headers || input.headers;

    if (headers !== undefined) {
      /* c8 ignore start */
      if (hasHeaders && headers instanceof Headers) {
        var _iterator = _createForOfIteratorHelper(headers.entries()),
            _step;

        try {
          for (_iterator.s(); !(_step = _iterator.n()).done;) {
            var pair = _step.value;
            lines.push("".concat(pair[0], ": ").concat(pair[1]));
          }
        } catch (err) {
          _iterator.e(err);
        } finally {
          _iterator.f();
        }
      } else {
        /* c8 ignore stop */
        for (var _key in headers) {
          lines.push("".concat(_key, ": ").concat(headers[_key]));
        }
      }
    }

    var body = init.body;

    if (body !== undefined) {
      if (~["GET", "HEAD"].indexOf(method)) throw new Error("Option body not valid with method ".concat(method));
      /* c8 ignore start */

      if (hasBlob && body instanceof Blob) {
        lines.push("");
        lines.push(blobToString(body));
      } else if (
      /* c8 ignore stop */
      typeof body === "string" || body instanceof String ||
      /* c8 ignore start */
      hasBuffer && body instanceof Buffer || hasURLSearchParams && body instanceof URLSearchParams
      /* c8 ignore stop */
      ) {
        lines.push("");
        lines.push(body.toString());
      } else throw new Error("Option body should be convertible to a string");
    }

    return lines.join("\r\n");
  }

  return fetchHttpMessage;

}));
//# sourceMappingURL=fetch-http-message.js.map

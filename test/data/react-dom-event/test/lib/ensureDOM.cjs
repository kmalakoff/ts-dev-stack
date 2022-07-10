(function ensureDom() {
  if (typeof window !== 'undefined') return; // running in the browser

  var jsdom = require('jsdom');
  var dom = new jsdom.JSDOM('<!doctype html><html><body></body></html>');
  global.window = dom.window;
  global.document = dom.window.document;
  global.navigator = dom.window.navigator;
  global.ShadowRoot = dom.window.ShadowRoot;
  global.ResizeObserver = dom.window.ResizeObserver;
})();

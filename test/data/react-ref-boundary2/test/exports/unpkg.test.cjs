/* eslint-disable @typescript-eslint/no-var-requires */
const { describe, it } = require('@jest/globals');
const assert = require('assert');
const {
  BoundaryProvider,
  useRef,
  useBoundary,
} = require('react-ref-boundary/dist/umd/react-ref-boundary.min.js');

describe('exports react-ref-boundary/dist/umd/react-ref-boundary.js', function () {
  it('defaults', function () {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
});

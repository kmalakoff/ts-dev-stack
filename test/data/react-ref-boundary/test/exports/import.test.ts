import { describe, it } from '@jest/globals';
import assert from 'assert';
import { BoundaryProvider, useRef, useBoundary } from 'react-ref-boundary';

describe('exports .ts', function () {
  it('defaults', function () {
    assert.equal(typeof BoundaryProvider, 'function');
    assert.equal(typeof useRef, 'function');
    assert.equal(typeof useBoundary, 'function');
  });
});

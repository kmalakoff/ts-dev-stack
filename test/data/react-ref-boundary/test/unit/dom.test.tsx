/**
 * @jest-environment jsdom
 */

import { describe, it } from '@jest/globals';
import assert from 'assert';
import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ErrorBoundary } from 'react-error-boundary';

import { BoundaryProvider, useRef, useBoundary } from 'react-ref-boundary';

describe('react-dom', function () {
  function NonBoundaryComponent() {
    const ref = React.useRef<HTMLDivElement>(null);
    return <div ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<HTMLDivElement>(null);
    return <div ref={ref} />;
  }

  function BoundaryChecker({ getRefs }) {
    const boundary = useBoundary();
    getRefs(boundary.refs);
    return <React.Fragment />;
  }

  it('refs', function () {
    let refs = [];
    function getRefs(x) {
      refs = x;
    }
    assert.equal(refs.length, 0);
    render(
      <BoundaryProvider>
        <BoundaryComponent />
        <NonBoundaryComponent />
        <BoundaryComponent />
        <BoundaryChecker getRefs={getRefs} />
      </BoundaryProvider>,
    );
    assert.equal(refs.length, 2);
  });

  it('errors: useRef without provider', function () {
    function ErrorFallback({ error }) {
      return <div>{error.message}</div>;
    }

    let err = false;
    render(
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={function () {
          err = true;
        }}
      >
        <BoundaryComponent />
      </ErrorBoundary>,
    );
    assert.ok(!!err);
  });

  it('errors: useBoundary without provider', function () {
    function ErrorFallback({ error }) {
      return <div>{error.message}</div>;
    }
    let refs = [];
    function getRefs(x) {
      refs = x;
    }

    let err = false;
    render(
      <ErrorBoundary
        FallbackComponent={ErrorFallback}
        onError={function () {
          err = true;
        }}
      >
        <BoundaryChecker getRefs={getRefs} />
      </ErrorBoundary>,
    );
    assert.ok(!!err);
    assert.equal(refs.length, 0);
  });
});

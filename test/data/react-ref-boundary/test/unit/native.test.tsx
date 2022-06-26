import { describe, it } from '@jest/globals';
import assert from 'assert';
import React from 'react';
import { fireEvent, render } from '@testing-library/react-native';
import { ErrorBoundary } from 'react-error-boundary';

import { View } from 'react-native';
import { BoundaryProvider, useRef, useBoundary } from 'react-ref-boundary';

describe('react-native', function () {
  function NonBoundaryComponent() {
    const ref = React.useRef<View>(null);
    return <View ref={ref} />;
  }

  function BoundaryComponent() {
    const ref = useRef<View>(null);
    return <View ref={ref} />;
  }

  function BoundaryChecker({ getRefs }) {
    const boundary = useBoundary();
    return <View testID="boundary" onPress={() => getRefs(boundary.refs)} />;
  }

  it('refs', function () {
    let refs = [];
    function getRefs(x) {
      refs = x;
    }
    const { getByTestId } = render(
      <BoundaryProvider>
        <BoundaryComponent />
        <NonBoundaryComponent />
        <BoundaryComponent />
        <BoundaryChecker getRefs={getRefs} />
      </BoundaryProvider>,
    );

    assert.equal(refs.length, 0);
    fireEvent.press(getByTestId('boundary') as Element);
    assert.equal(refs.length, 2);
  });

  it('errors: useRef without provider', function () {
    function ErrorFallback({ error }) {
      return <View>{error.message}</View>;
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
      return <View>{error.message}</View>;
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

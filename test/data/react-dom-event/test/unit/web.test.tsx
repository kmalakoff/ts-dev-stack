global.IS_REACT_ACT_ENVIRONMENT = true;
import '../lib/ensureDOM.cjs';

import assert from 'assert';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { View } from 'react-native-web';
import { useEvent, EventProvider } from 'react-dom-event';
import getByTestId from '../lib/getByTestId';

describe('react-native-web', function () {
  let container: HTMLDivElement | null = null;
  let root: Root | null = null;
  beforeEach(function () {
    container = document.createElement('div');
    document.body.appendChild(container);
    root = createRoot(container);
  });

  afterEach(function () {
    act(() => root.unmount());
    root = null;
    container.remove();
    container = null;
  });

  it('click', function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <View>
          <EventProvider>
            <View testID="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <View testID="outside" onClick={onClick} />
        </View>
      );
    }

    let clickValue;
    const onClick = (x) => (clickValue = x);
    let eventValue;
    const onEvent = (x) => (eventValue = x);
    act(() => root.render(<Component onClick={onClick} onEvent={onEvent} />));
    assert.equal(clickValue, undefined);
    assert.equal(eventValue, undefined);

    // inside
    clickValue = undefined;
    eventValue = undefined;
    act(() => (getByTestId(container, 'inside') as HTMLElement).click());
    assert.equal(clickValue.target, getByTestId(container, 'inside'));
    assert.ok(!!eventValue);

    // outside
    clickValue = undefined;
    eventValue = undefined;
    act(() => (getByTestId(container, 'outside') as HTMLElement).click());
    assert.equal(clickValue.target, getByTestId(container, 'outside'));
    assert.ok(!!eventValue);
  });
});

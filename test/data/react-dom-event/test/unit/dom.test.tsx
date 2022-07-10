global.IS_REACT_ACT_ENVIRONMENT = true;
import '../lib/ensureDOM.cjs';

import assert from 'assert';
import React from 'react';
import { createRoot, Root } from 'react-dom/client';
import { act } from 'react-dom/test-utils';

import { useEvent, EventProvider } from 'react-dom-event';

describe('react-dom', function () {
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

  it('click default', function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <EventProvider>
            <button id="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <button id="outside" onClick={onClick} />
        </div>
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
    act(() => (container.querySelector('#inside') as HTMLElement).click());
    assert.equal(clickValue.target, container.querySelector('#inside'));
    assert.ok(!!eventValue);

    // outside
    clickValue = undefined;
    eventValue = undefined;
    act(() => (container.querySelector('#outside') as HTMLElement).click());
    assert.equal(clickValue.target, container.querySelector('#outside'));
    assert.ok(!!eventValue);
  });

  it('click explicit', function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <EventProvider events={['click']}>
            <button id="inside" onClick={onClick} />
            <UseEventComponent onEvent={onEvent} />
          </EventProvider>
          <button id="outside" onClick={onClick} />
        </div>
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
    act(() => (container.querySelector('#inside') as HTMLElement).click());
    assert.equal(clickValue.target, container.querySelector('#inside'));
    assert.ok(!!eventValue);
  });

  // TODO: test on the browser
  it.skip('click missing provider', function () {
    function UseEventComponent({ onEvent }) {
      useEvent(onEvent, [onEvent]);
      return <React.Fragment />;
    }

    function Component({ onClick, onEvent }) {
      return (
        <div>
          <button id="inside" onClick={onClick} />
          <UseEventComponent onEvent={onEvent} />
          <button id="outside" onClick={onClick} />
        </div>
      );
    }

    try {
      const onClick = () => {
        /* emptty */
      };
      const onEvent = () => {
        /* emptty */
      };
      act(() => root.render(<Component onClick={onClick} onEvent={onEvent} />));
    } catch (err) {
      assert.ok(err.message.indexOf('subscribe not found on context') >= 0);
    }
  });
});

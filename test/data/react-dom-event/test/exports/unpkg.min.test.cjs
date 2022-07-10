/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const { EventContext, useEvent, EventProvider } = require('react-dom-event');

describe('exports react-dom-event/dist/umd/react-dom-event.min.js', function () {
  it('defaults', function () {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});

const assert = require('assert');
const { EventContext, useEvent, EventProvider } = require('react-dom-event');

describe('exports .ts', function () {
  it('defaults', function () {
    assert.equal(typeof EventContext, 'object');
    assert.equal(typeof EventProvider, 'function');
    assert.equal(typeof useEvent, 'function');
  });
});

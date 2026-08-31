const assert = require('assert');
const { runCommand } = require('ts-dev-stack');

describe('exports .cjs', () => {
  it('defaults', () => {
    assert.equal(typeof runCommand, 'function');
  });
});

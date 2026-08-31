import assert from 'assert';
import { runCommand } from 'ts-dev-stack';

describe('exports .mjs', () => {
  it('defaults', () => {
    assert.equal(typeof runCommand, 'function');
  });
});

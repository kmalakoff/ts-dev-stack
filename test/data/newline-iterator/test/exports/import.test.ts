import assert from 'assert';
import newlineIterator from 'newline-iterator';

describe('exports .ts', function () {
  it('first newline', function () {
    const iterator = newlineIterator('some\r\nstring\ncombination\r');
    assert.deepEqual(iterator.next(), { value: 'some', done: false });
  });
});

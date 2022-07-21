/* eslint-disable @typescript-eslint/no-var-requires */
const assert = require('assert');
const newlineIterator = require('newline-iterator');

describe('exports .cjs', function () {
  it('first newline', function () {
    const iterator = newlineIterator('some\r\nstring\ncombination\r');
    assert.deepEqual(iterator.next(), { value: 'some', done: false });
  });
});

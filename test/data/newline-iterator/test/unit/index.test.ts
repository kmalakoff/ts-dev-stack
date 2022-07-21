import assert from 'assert';
import newlineIterator from 'newline-iterator';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.iterator;

describe('newline-iterator', function () {
  describe('next', function () {
    it('all values', function () {
      const string = 'some\r\nstring\ncombination\r';
      const iterator = newlineIterator(string);

      assert.deepEqual(iterator.next(), { value: 'some', done: false });
      assert.deepEqual(iterator.next(), { value: 'string', done: false });
      assert.deepEqual(iterator.next(), { value: 'combination', done: false });
      assert.deepEqual(iterator.next(), { value: undefined, done: true });
    });

    it('no end', function () {
      const string = 'some\r\nstring\ncombination';
      const iterator = newlineIterator(string);
      assert.deepEqual(iterator.next(), { value: 'some', done: false });
      assert.deepEqual(iterator.next(), { value: 'string', done: false });
      assert.deepEqual(iterator.next(), { value: 'combination', done: false });
      assert.deepEqual(iterator.next(), { value: undefined, done: true });
    });

    it('no breaks', function () {
      const string = 'somestringcombination';
      const iterator = newlineIterator(string);
      assert.deepEqual(iterator.next(), { value: 'somestringcombination', done: false });
      assert.deepEqual(iterator.next(), { value: undefined, done: true });
    });
  });

  !hasIterator ||
    describe('iterator', function () {
      it('all values', function () {
        const string = 'some\r\nstring\ncombination\r';
        const iterator = newlineIterator(string);

        const results = [];
        for (const line of iterator) results.push(line);
        assert.deepEqual(results, ['some', 'string', 'combination']);
      });

      it('no breaks', function () {
        const string = 'somestringcombination';
        const iterator = newlineIterator(string);
        const results = [];
        for (const line of iterator) results.push(line);
        assert.deepEqual(results, ['somestringcombination']);
      });
    });
});

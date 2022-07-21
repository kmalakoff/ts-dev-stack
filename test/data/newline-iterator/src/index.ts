import indexOfNewline from 'index-of-newline';

const hasIterator = typeof Symbol !== 'undefined' && Symbol.iterator;

/**
 * Create a newline iterator recognizing CR, LF, and CRLF using the Symbol.iterator interface
 *
 * @param string The string to iterate through
 *
 * ```typescript
 * import newlineIterator from "newline-iterator";
 *
 * const iterator = newlineIterator("some\r\nstring\ncombination\r");
 * const results = [];
 * for (const line of iterator) results.push(line);
 * console.log(results); // ["some", "string", "combination"];
 * ```
 */
export default function newlineIterator(string: string): IterableIterator<string> {
  let offset = 0;
  const iterator = {
    next(): IteratorResult<string, boolean> {
      if (offset >= string.length) return { value: undefined, done: true };
      const args = indexOfNewline(string, offset, true) as number[];
      let index = args[0];
      let skip = args[1];
      if (index < 0) {
        index = string.length;
        skip = 0;
      }
      const line = string.substr(offset, index - offset);
      offset = index + skip;
      return { value: line, done: false };
    },
  };

  if (hasIterator) {
    iterator[Symbol.iterator] = function (): Iterator<string> {
      return this;
    };
  }

  return iterator as IterableIterator<string>;
}

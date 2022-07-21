## newline-iterator

Line-by-line string iterator

### Example 1

```typescript
import newlineIterator from 'newline-iterator';

const iterator = newlineIterator('some\r\nstring\ncombination\r');
const results = [];
for (const line of iterator) results.push(line);
console.log(results); // ["some", "string", "combination"];
```

### Example 2

```typescript
import newlineIterator from 'newline-iterator';

const iterator = newlineIterator('some\r\nstring\ncombination\r');
console.log(iterator.next()); // { value: "some", done: false }
console.log(iterator.next()); // { value: "srting", done: false }
console.log(iterator.next()); // { value: "combination", done: false }
console.log(iterator.next()); // { value: undefined, done: true }
```

### Documentation

[API Docs](https://kmalakoff.github.io/newline-iterator/)

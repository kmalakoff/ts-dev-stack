## fetch-http-message

Generate an http message string using the fetch API for browser and node

### Example 1

```typescript
import fetchMessage from 'fetch-http-message';

const headers = { header1: 'value 1', header2: 'value 2' };
const message = fetchMessage('https://test.com/', { method: 'PATCH', headers, body: 'post-body' });
console.log(message); // "PATCH https://test.com/ HTTP/1.1\r\nheader1: value 1\r\nheader2: value 2\r\n\r\npost-body"
```

### Example 2

```typescript
import fetchMessage from 'fetch-http-message';

const headers = new Headers();
headers.set('header1', 'value 1');
headers.set('header2', 'value 2');
const message = fetchMessage('https://test.com/', { method: 'PATCH', headers, body: 'post-body' });
console.log(message); // "PATCH https://test.com/ HTTP/1.1\r\nheader1: value 1\r\nheader2: value 2\r\n\r\npost-body"
```

### Documentation

[API Docs](https://kmalakoff.github.io/fetch-http-message/)

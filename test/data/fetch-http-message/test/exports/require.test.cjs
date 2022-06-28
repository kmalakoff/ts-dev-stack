const assert = require('assert');
const fetchMessage = require('fetch-http-message');

const url = 'https://test.com/';

describe('exports .cjs', function () {
  it('defaults', function () {
    const message = fetchMessage(url);
    assert.equal(message, `GET ${url} HTTP/1.1`);
  });
});

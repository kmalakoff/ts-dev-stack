/* eslint-disable @typescript-eslint/no-var-requires */
const { assert } = require('chai');
const fetchMessage = require('fetch-http-message/dist/umd/fetch-http-message.js');

const url = 'https://test.com/';

describe('exports fetch-http-message/dist/umd/fetch-http-message.js', function () {
  it('defaults', function () {
    const message = fetchMessage(url);
    assert.equal(message, `GET ${url} HTTP/1.1`);
  });
});

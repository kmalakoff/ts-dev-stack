import '../lib/polyfill.js';
import assert from 'assert';
import fetchMessage, { HeadersObject } from 'fetch-http-message';

const url = 'https://test.com/';

describe('fetch-http-message', function () {
  it('error: no url', function () {
    assert.throws(() => fetchMessage(undefined));
  });

  it('defaults', function () {
    const message = fetchMessage(url);
    assert.equal(message, `GET ${url} HTTP/1.1`);
  });

  it('default method', function () {
    const message = fetchMessage(url, {});
    assert.equal(message, `GET ${url} HTTP/1.1`);
  });

  describe('method', function () {
    it('POST', function () {
      const message = fetchMessage(url, { method: 'POST' });
      assert.equal(message, `POST ${url} HTTP/1.1`);
    });

    it('POST body', function () {
      const message = fetchMessage(url, { method: 'POST', body: 'post-body' });
      assert.equal(message, [`POST ${url} HTTP/1.1`, '', 'post-body'].join('\r\n'));
    });
  });

  describe('HeadersObject', function () {
    it('multiple headers', function () {
      const headers = { header1: 'value 1', header2: 'value 2' };
      const message = fetchMessage(url, { method: 'POST', headers });
      assert.equal(message, [`POST ${url} HTTP/1.1`, 'header1: value 1', 'header2: value 2'].join('\r\n'));
    });

    it('multiple headers and body', function () {
      const headers = { header1: 'value 1', header2: 'value 2' };
      const message = fetchMessage(url, {
        method: 'PATCH',
        headers,
        body: 'post-body',
      });
      assert.equal(message, [`PATCH ${url} HTTP/1.1`, 'header1: value 1', 'header2: value 2', '', 'post-body'].join('\r\n'));
    });
  });

  typeof Headers === 'undefined' ||
    describe('Headers', function () {
      it('multiple headers', function () {
        const headers = new Headers();
        headers.set('header1', 'value 1');
        headers.set('header2', 'value 2');
        const message = fetchMessage(url, { method: 'POST', headers });
        assert.equal(message, [`POST ${url} HTTP/1.1`, 'header1: value 1', 'header2: value 2'].join('\r\n'));
      });

      it('multiple headers and body', function () {
        const headers = new Headers();
        headers.set('header1', 'value 1');
        headers.set('header2', 'value 2');
        const message = fetchMessage(url, {
          method: 'PATCH',
          headers,
          body: 'post-body',
        });
        assert.equal(message, [`PATCH ${url} HTTP/1.1`, 'header1: value 1', 'header2: value 2', '', 'post-body'].join('\r\n'));
      });
    });

  describe('body', function () {
    it('error: GET with body', function () {
      assert.throws(() => fetchMessage(url, { method: 'GET', body: 'get-body' }));
    });

    it('error: HEAD with body', function () {
      assert.throws(() => fetchMessage(url, { method: 'HEAD', body: 'get-body' }));
    });

    it('error: non-string body', function () {
      const body = function body() {
        return null;
      } as unknown;
      assert.throws(() => fetchMessage(url, { method: 'POST', body: body as string }));
    });

    it('string body', function () {
      const message = fetchMessage(url, { method: 'POST', body: 'post-body' });
      assert.equal(message, [`POST ${url} HTTP/1.1`, '', 'post-body'].join('\r\n'));
    });

    typeof Blob === 'undefined' ||
      typeof XMLHttpRequest === 'undefined' ||
      it('Blob body', function () {
        const message = fetchMessage(url, {
          method: 'POST',
          body: new Blob([JSON.stringify({ test: true })], {
            type: 'application/json',
          }),
        });
        assert.equal(message, [`POST ${url} HTTP/1.1`, '', '{"test":true}'].join('\r\n'));
      });

    typeof Buffer === 'undefined' ||
      it.skip('Buffer body', function () {
        const message = fetchMessage(url, {
          method: 'POST',
          body: Buffer.alloc(5, 'a'),
        });
        assert.equal(message, [`POST ${url} HTTP/1.1`, '', 'aaaaa'].join('\r\n'));
      });

    typeof URLSearchParams === 'undefined' ||
      it('URLSearchParams body', function () {
        const string = 'q=URLUtils.searchParams&topic=api';
        const message = fetchMessage(url, {
          method: 'POST',
          body: new URLSearchParams(string),
        });
        assert.equal(message, [`POST ${url} HTTP/1.1`, '', string].join('\r\n'));
      });
  });

  describe('init', function () {
    it('GET not override', function () {
      const message = fetchMessage({ url, method: 'GET', headers: {} as HeadersObject }, {});
      assert.equal(message, `GET ${url} HTTP/1.1`);
    });

    it('POST override', function () {
      const message = fetchMessage({ url, method: 'GET', headers: {} as HeadersObject }, { method: 'POST' });
      assert.equal(message, `POST ${url} HTTP/1.1`);
    });

    it('headers not override', function () {
      const headers1 = { x: 'value 1', y: 'value 2' } as HeadersObject;
      const message = fetchMessage({ url, method: 'GET', headers: headers1 }, { method: 'PATCH', body: 'post-body' });
      assert.equal(message, [`PATCH ${url} HTTP/1.1`, 'x: value 1', 'y: value 2', '', 'post-body'].join('\r\n'));
    });

    it('headers override', function () {
      const headers1 = { x: 'value 1', y: 'value 2' } as HeadersObject;
      const headers2 = {
        header1: 'value 1',
        header2: 'value 2',
      } as HeadersObject;
      const message = fetchMessage({ url, method: 'GET', headers: headers1 }, { method: 'PATCH', headers: headers2, body: 'post-body' });
      assert.equal(message, [`PATCH ${url} HTTP/1.1`, 'header1: value 1', 'header2: value 2', '', 'post-body'].join('\r\n'));
    });
  });
});

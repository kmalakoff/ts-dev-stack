import { assert } from "chai";
import fetchMessage from "fetch-http-message";

const url = "https://test.com/";

describe("exports .ts", function () {
  it("defaults", function () {
    const message = fetchMessage(url);
    assert.equal(message, `GET ${url} HTTP/1.1`);
  });
});

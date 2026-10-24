const test = require("node:test");
const assert = require("node:assert");
const app = require("../server");

let server;
let base;

test.before(
  () =>
    new Promise((resolve) => {
      server = app.listen(0, () => {
        base = `http://localhost:${server.address().port}`;
        resolve();
      });
    })
);

test.after(() => server.close());

test("GET /health returns OK", async () => {
  const res = await fetch(`${base}/health`);
  assert.strictEqual(res.status, 200);
  assert.deepStrictEqual(await res.json(), { status: "OK" });
});

test("GET /api/hello uses the name query", async () => {
  const res = await fetch(`${base}/api/hello?name=Neetesh`);
  const body = await res.json();
  assert.strictEqual(body.message, "Hello, Neetesh!");
});

test("unknown route returns 404", async () => {
  const res = await fetch(`${base}/nope`);
  assert.strictEqual(res.status, 404);
});
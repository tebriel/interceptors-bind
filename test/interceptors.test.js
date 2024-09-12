import http from "node:http";
import { test } from "vitest";
import { BatchInterceptor } from '@mswjs/interceptors'
import nodeInterceptors from '@mswjs/interceptors/presets/node'

const interceptor = new BatchInterceptor({
  name: 'my-interceptor',
  interceptors: nodeInterceptors,
})

// Enable the interception of requests.
interceptor.apply();

interceptor.on(
  'unhandledException',
  ({ error, request, requestId, controller }) => {
    console.log(error)
  }
)

test("POST /a/b/c", async () =>
  new Promise((done) => {
    const { HttpAgent } = require("../src/agents");
    const options = {
      host: '127.0.0.1',
      agent: HttpAgent,
    };
    http.get(options, (res) => {
      done();
    });
  }));

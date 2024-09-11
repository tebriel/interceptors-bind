import http from "node:http";
import { expect, test, vi } from "vitest";
import { ClientRequestInterceptor } from "@mswjs/interceptors/ClientRequest";

import { HttpAgent } from "../src/agents";

const mockFailbot = { report: vi.fn() };

const interceptor = new ClientRequestInterceptor();

// Enable the interception of requests.
interceptor.apply();

// Listen to any "http.ClientRequest" being dispatched,
// and log its method and full URL.
interceptor.on("request", ({ request, requestId, controller }) => {
  console.log(request.method, request.url);
  controller.respondWith(
    new Response("", {
      status: 200,
      statusText: "OK",
      headers: {},
    }),
  );
});

// Listen to any responses sent to "http.ClientRequest".
// Note that this listener is read-only and cannot affect responses.
interceptor.on(
  "response",
  ({ response, isMockedResponse, request, requestId }) => {
    console.log(
      "response to %s %s was:",
      request.method,
      request.url,
      response,
    );
  },
);

interceptor.on(
  'unhandledException',
  ({ error, request, requestId, controller }) => {
    console.log(error)
  }
)

test("POST /a/b/c", async () =>
  new Promise((done) => {
    console.log('promise');
    try {
      console.log('try');
      const req = http.request(
        {
          host: '127.0.0.1',
          port: '80',
          protocol: 'http:',
          agent: HttpAgent,
          method: 'POST',
        },
        (res) => {
          res.on('end', () => {
            console.log('done');
            done();
          });
          console.log('hi');
          expect(res.statusCode).toEqual(200);
        },
      );
      console.log('sent');
      req.on('error', (e) => {
        console.error(`problem with request: ${e.message}`);
      });
      req.write('');
      req.end();
    } catch (error) {
      console.log(error);
      done();
    } finally {
      console.log('finally');
    }
  }));

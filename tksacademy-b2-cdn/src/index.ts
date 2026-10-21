/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `npm run dev` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `npm run deploy` to publish your worker
 *
 * Bind resources to your worker in `wrangler.jsonc`. After adding bindings, a type definition for the
 * `Env` object can be regenerated with `npm run cf-typegen`.
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

// export default {
// 	async fetch(request, env, ctx): Promise<Response> {
// 		const url = new URL(request.url);
// 		switch (url.pathname) {
// 			case '/message':
// 				return new Response('Hello, World!');
// 			case '/random':
// 				return new Response(crypto.randomUUID());
// 			default:
// 				return new Response('Not Found', { status: 404 });
// 		}
// 	},
// } satisfies ExportedHandler<Env>;


export interface Env {
  B2_BUCKET_NAME: string;
  B2_DOWNLOAD_URL: string;
}

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS",
  "Access-Control-Allow-Headers": "*",
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {

    if (request.method === "OPTIONS") {
      return new Response(null, {
        status: 204,
        headers: CORS_HEADERS,
      });
    }

    const url = new URL(request.url);

    let filePath = url.pathname;

    // Incoming URL:
    // /file/tksacademy-media/videos/demo.mp4

    const prefix = `/file/${env.B2_BUCKET_NAME}/`;

    if (!filePath.startsWith(prefix)) {
      return new Response("Invalid path", {
        status: 400,
      });
    }

    filePath = filePath.substring(prefix.length);

    // Result:
    // videos/demo.mp4

    const b2Url =
      `${env.B2_DOWNLOAD_URL}/file/${env.B2_BUCKET_NAME}/${filePath}`;

    const headers = new Headers();

    const auth = url.searchParams.get("Authorization");

    if (auth) {
      headers.set("Authorization", auth);
    }

    const range = request.headers.get("Range");

    if (range) {
      headers.set("Range", range);
    }

    const response = await fetch(b2Url, {
      method: request.method,
      headers,
    });

    const responseHeaders = new Headers(response.headers);

    responseHeaders.set("Access-Control-Allow-Origin", "*");
    responseHeaders.set("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS");
    responseHeaders.set("Access-Control-Allow-Headers", "*");

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    });
  },
};
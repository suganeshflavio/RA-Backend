/**
 * Reverse-proxies Backblaze B2 file reads behind a Cloudflare-branded domain.
 *
 * The Node backend already generates fully-signed B2 download URLs
 * (`https://<b2-download-host>/file/<bucket>/<path>?Authorization=<token>`).
 * This Worker sits on a custom domain, receives that same path + query, and
 * forwards it to the real B2 host — swapping in the Backblaze+Cloudflare
 * Bandwidth Alliance for free egress, and giving Range-aware edge caching so
 * large (1-2GB) video files scrub smoothly instead of re-hitting B2 on every seek.
 *
 * B2 itself performs all auth (the Authorization query param is B2's own
 * download-authorization token, minted per request by the backend) — this
 * Worker does not need any secrets of its own.
 */

export interface Env {
  // e.g. "f005.backblazeb2.com" — the `downloadUrl` host B2 returned from
  // b2_authorize_account for this account/bucket. Stable per account.
  B2_DOWNLOAD_HOST: string;
}

const PASSTHROUGH_REQUEST_HEADERS = [
  "range",
  "if-range",
  "if-none-match",
  "if-modified-since",
];

const PASSTHROUGH_RESPONSE_HEADERS = [
  "content-type",
  "content-length",
  "content-range",
  "accept-ranges",
  "etag",
  "last-modified",
];

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders() });
    }

    if (request.method !== "GET" && request.method !== "HEAD") {
      return new Response("Method not allowed", { status: 405 });
    }

    const url = new URL(request.url);

    if (!url.pathname.startsWith("/file/")) {
      return new Response("Not found", { status: 404 });
    }

    const upstreamUrl = `https://${env.B2_DOWNLOAD_HOST}${url.pathname}${url.search}`;

    const upstreamHeaders = new Headers();
    for (const name of PASSTHROUGH_REQUEST_HEADERS) {
      const value = request.headers.get(name);
      if (value) upstreamHeaders.set(name, value);
    }

    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers: upstreamHeaders,
    });

    const responseHeaders = new Headers(corsHeaders());
    for (const name of PASSTHROUGH_RESPONSE_HEADERS) {
      const value = upstreamResponse.headers.get(name);
      if (value) responseHeaders.set(name, value);
    }

    // The URL carries a time-limited B2 auth token, so caching by full URL
    // (Cloudflare's default cache key) is safe — repeated seeks against the
    // same signed URL get served from the edge instead of hitting B2 again.
    responseHeaders.set("Cache-Control", "private, max-age=300");

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  },
};

const corsHeaders = () => ({
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
  "Access-Control-Allow-Headers": "Range, If-Range, If-None-Match, If-Modified-Since",
});

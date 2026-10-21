import {
	env,
	createExecutionContext,
	waitOnExecutionContext,
	SELF,
} from "cloudflare:test";
import { describe, it, expect } from "vitest";
import worker from "../src";

describe("Ramars Academy B2 CDN Worker", () => {
	it("responds to OPTIONS preflight with CORS headers", async () => {
		const request = new Request("http://example.com/file/ramarsacademy-multimedia/test.mp4", {
			method: "OPTIONS",
		});
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		expect(response.status).toBe(204);
		expect(response.headers.get("Access-Control-Allow-Origin")).toBe("*");
	});

	it("returns 400 for paths not matching the bucket prefix", async () => {
		const request = new Request("http://example.com/other-path");
		const ctx = createExecutionContext();
		const response = await worker.fetch(request, env, ctx);
		expect(response.status).toBe(400);
		expect(await response.text()).toBe("Invalid path");
	});
});

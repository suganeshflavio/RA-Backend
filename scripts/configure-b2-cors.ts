/**
 * One-off setup script: configures CORS rules on the B2 bucket so browsers
 * can upload video directly to B2 (the presigned upload-url flow triggers a
 * CORS preflight because it sends custom headers like Authorization and
 * X-Bz-File-Name cross-origin).
 *
 * Run with: npm run configure-b2-cors
 *
 * Set B2_CORS_ORIGINS in .env to a comma-separated list of allowed origins,
 * e.g. "http://localhost:3001,https://app.yourdomain.com". Re-run any time
 * that list changes — it overwrites the bucket's existing CORS rules.
 */
import dotenv from "dotenv";
dotenv.config();

import { authorizeB2, B2_BUCKET_ID } from "../src/config/b2";

const B2_UPDATE_BUCKET_PATH = "/b2api/v2/b2_update_bucket";

const main = async () => {

  const origins = (process.env.B2_CORS_ORIGINS ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

  if (origins.length === 0) {
    throw new Error(
      "Set B2_CORS_ORIGINS in .env to a comma-separated list of allowed origins before running this script."
    );
  }

  const session = await authorizeB2();

  const res = await fetch(`${session.apiUrl}${B2_UPDATE_BUCKET_PATH}`, {
    method: "POST",
    headers: {
      Authorization: session.authorizationToken,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      accountId: session.accountId,
      bucketId: B2_BUCKET_ID,
      corsRules: [
        {
          corsRuleName: "allow-app-video-upload",
          allowedOrigins: origins,
          allowedOperations: [
            "b2_upload_file",
            "b2_upload_part",
            "b2_download_file_by_name",
            "b2_download_file_by_id",
          ],
          allowedHeaders: ["*"],
          exposeHeaders: ["x-bz-content-sha1", "x-bz-file-name"],
          maxAgeSeconds: 3600,
        },
      ],
    }),
  });

  if (!res.ok) {
    throw new Error(`b2_update_bucket failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();

  console.log("B2 bucket CORS rules updated:");
  console.log(JSON.stringify(data.corsRules, null, 2));

};

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

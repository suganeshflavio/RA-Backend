import fs from "fs";
import crypto from "crypto";
import { authorizeB2, B2_BUCKET_ID, B2_BUCKET_NAME } from "../config/b2";

const DEFAULT_SIGNED_URL_TTL_SECONDS = 60 * 60; // 1 hour

// Once a Cloudflare Worker is deployed in front of B2 (see cloudflare-worker/),
// set this to the Worker's custom domain to route reads through it instead of
// hitting the raw *.backblazeb2.com host directly.
const CDN_BASE_URL = process.env.CDN_BASE_URL?.replace(/\/$/, "");

export const sanitizeFileName = (name: string) => name.replace(/[^a-zA-Z0-9._-]/g, "_");

export const encodeB2FileName = (fileName: string) =>
  fileName.split("/").map(encodeURIComponent).join("/");

interface B2UploadUrl {
  uploadUrl: string;
  authorizationToken: string;
}

export const getB2UploadUrl = async (): Promise<B2UploadUrl> => {

  const session = await authorizeB2();

  const res = await fetch(`${session.apiUrl}/b2api/v2/b2_get_upload_url`, {
    method: "POST",
    headers: {
      Authorization: session.authorizationToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ bucketId: B2_BUCKET_ID })
  });

  if (!res.ok) {
    throw new Error(`B2 get_upload_url failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();

  return {
    uploadUrl: data.uploadUrl,
    authorizationToken: data.authorizationToken
  };

};

interface B2UploadResult {
  fileId: string;
  fileName: string;
  size: number;
}

export const uploadFileToB2 = async (
  file: Express.Multer.File,
  keyPrefix: string
): Promise<B2UploadResult> => {

  const { uploadUrl, authorizationToken } = await getB2UploadUrl();

  const buffer = await fs.promises.readFile(file.path);

  const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");

  const fileName = `${keyPrefix}/${Date.now()}-${sanitizeFileName(file.originalname)}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: authorizationToken,
      "X-Bz-File-Name": encodeB2FileName(fileName),
      "Content-Type": file.mimetype || "b2/x-auto",
      "X-Bz-Content-Sha1": sha1,
      "Content-Length": String(buffer.length)
    },
    body: buffer
  });

  await fs.promises.unlink(file.path).catch(() => {});

  if (!res.ok) {
    throw new Error(`B2 upload failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();

  return {
    fileId: data.fileId,
    fileName: data.fileName,
    size: data.contentLength
  };

};

export const getB2SignedUrl = async (
  fileName: string,
  validDurationInSeconds = DEFAULT_SIGNED_URL_TTL_SECONDS
): Promise<string> => {

  const session = await authorizeB2();

  const res = await fetch(`${session.apiUrl}/b2api/v2/b2_get_download_authorization`, {
    method: "POST",
    headers: {
      Authorization: session.authorizationToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      bucketId: B2_BUCKET_ID,
      fileNamePrefix: fileName,
      validDurationInSeconds
    })
  });

  if (!res.ok) {
    throw new Error(`B2 get_download_authorization failed: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();

  const path = `/file/${B2_BUCKET_NAME}/${encodeB2FileName(fileName)}?Authorization=${data.authorizationToken}`;

  return `${CDN_BASE_URL || session.downloadUrl}${path}`;

};

export const deleteB2File = async (
  fileId: string,
  fileName: string
): Promise<void> => {

  const session = await authorizeB2();

  const res = await fetch(`${session.apiUrl}/b2api/v2/b2_delete_file_version`, {
    method: "POST",
    headers: {
      Authorization: session.authorizationToken,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ fileName, fileId })
  });

  if (!res.ok) {
    // best-effort cleanup - don't fail the calling request over a stale/missing B2 file
    console.error(`B2 delete_file_version failed for ${fileName}: ${res.status} ${await res.text()}`);
  }

};

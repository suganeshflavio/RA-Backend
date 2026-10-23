import crypto from "crypto";
import { authorizeB2, B2_BUCKET_ID, B2_BUCKET_NAME } from "../config/b2";
import { AppError } from "./errors/AppError";

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

  return uploadBufferToB2(file.buffer, file.originalname, file.mimetype, keyPrefix);

};

export const uploadBufferToB2 = async (
  buffer: Buffer,
  originalName: string,
  contentType: string,
  keyPrefix: string
): Promise<B2UploadResult> => {

  const { uploadUrl, authorizationToken } = await getB2UploadUrl();

  const sha1 = crypto.createHash("sha1").update(buffer).digest("hex");

  const fileName = `${keyPrefix}/${Date.now()}-${sanitizeFileName(originalName)}`;

  const res = await fetch(uploadUrl, {
    method: "POST",
    headers: {
      Authorization: authorizationToken,
      "X-Bz-File-Name": encodeB2FileName(fileName),
      "Content-Type": contentType || "b2/x-auto",
      "X-Bz-Content-Sha1": sha1,
      "Content-Length": String(buffer.length)
    },
    body: buffer as unknown as BodyInit
  });

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

interface B2DownloadResult {
  fileId: string;
  buffer: Buffer;
}

// Reads a private bucket file into memory. Refuses (without reading the body)
// anything larger than maxBytes, since the uploader controls what lands at a
// client-side upload URL and the size it declared up front isn't enforced.
export const downloadB2File = async (
  fileName: string,
  maxBytes: number
): Promise<B2DownloadResult> => {

  const session = await authorizeB2();

  const res = await fetch(`${session.downloadUrl}/file/${B2_BUCKET_NAME}/${encodeB2FileName(fileName)}`, {
    headers: { Authorization: session.authorizationToken }
  });

  if (res.status === 404) {
    throw new AppError("Uploaded file not found", 404);
  }

  if (!res.ok) {
    throw new Error(`B2 download failed: ${res.status} ${await res.text()}`);
  }

  const fileId = res.headers.get("x-bz-file-id") ?? "";

  const declaredSize = Number(res.headers.get("content-length") ?? 0);

  if (declaredSize > maxBytes) {
    await res.body?.cancel();
    await deleteB2File(fileId, fileName);
    throw new AppError(`File exceeds the ${Math.round(maxBytes / (1024 * 1024))} MB limit`, 400);
  }

  const buffer = Buffer.from(await res.arrayBuffer());

  if (buffer.length > maxBytes) {
    await deleteB2File(fileId, fileName);
    throw new AppError(`File exceeds the ${Math.round(maxBytes / (1024 * 1024))} MB limit`, 400);
  }

  return { fileId, buffer };

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

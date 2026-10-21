const B2_KEY_ID = process.env.B2_KEY_ID ?? "";
const B2_APPLICATION_KEY = process.env.B2_APPLICATION_KEY ?? "";

export const B2_BUCKET_ID = process.env.B2_BUCKET_ID ?? "";
export const B2_BUCKET_NAME = process.env.B2_BUCKET_NAME ?? "";

const B2_AUTHORIZE_URL =
  "https://api.backblazeb2.com/b2api/v2/b2_authorize_account";

interface B2Session {
  accountId: string;
  authorizationToken: string;
  apiUrl: string;
  downloadUrl: string;
  expiresAt: number;
}

let cachedSession: B2Session | null = null;

export const authorizeB2 = async (): Promise<B2Session> => {
  if (cachedSession && cachedSession.expiresAt > Date.now()) {
    return cachedSession;
  }

  const credentials = Buffer.from(
    `${B2_KEY_ID}:${B2_APPLICATION_KEY}`,
  ).toString("base64");

  const res = await fetch(B2_AUTHORIZE_URL, {
    headers: {
      Authorization: `Basic ${credentials}`,
    },
  });

  if (!res.ok) {
    throw new Error(
      `B2 authorization failed: ${res.status} ${await res.text()}`,
    );
  }

  const data = await res.json();

  cachedSession = {
    accountId: data.accountId,
    authorizationToken: data.authorizationToken,
    apiUrl: data.apiUrl,
    downloadUrl: data.downloadUrl,
    // B2 auth tokens are valid for 24h; refresh a little early
    expiresAt: Date.now() + 23 * 60 * 60 * 1000,
  };

  return cachedSession;
};

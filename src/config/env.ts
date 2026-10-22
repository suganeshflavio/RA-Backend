// export const env = {
//   PORT: Number(process.env.PORT) || 5000,

//   JWT_SECRET: process.env.JWT_SECRET || "",

//   JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",
// };
import dotenv from "dotenv";

dotenv.config();
const requiredEnv = [
  "DATABASE_URL",
  "JWT_SECRET",
  "B2_KEY_ID",
  "B2_APPLICATION_KEY",
  "B2_BUCKET_ID",
  "B2_BUCKET_NAME",
  "B2_CORS_ORIGINS",
  "JWT_EXPIRES_IN",
  "PORT",
  "DIRECT_URL",
  "CDN_BASE_URL",
  "API_BASE_URL"
];

for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`Missing environment variable: ${key}`);
  }
}

export const env = {
  PORT: Number(process.env.PORT) || 5000,
  databaseUrl: process.env.DATABASE_URL ?? "",
  // directUrl: process.env.DIRECT_URL ?? "",
  JWT_SECRET: process.env.JWT_SECRET ?? "",

  JWT_EXPIRES_IN: (process.env.JWT_EXPIRES_IN ?? "7d") as
    | "7d"
    | "1d"
    | "30d"
    | `${number}h`
    | `${number}m`
    | `${number}s`,

  // Backend's own publicly-reachable base URL (no trailing slash) — used to
  // build the stable /api/uploads/image/:id link embedded in stored
  // rich-text HTML. Must point at wherever this API is actually reachable
  // from a browser/app, not just localhost, once deployed.
  API_BASE_URL: (process.env.API_BASE_URL ?? `http://localhost:${Number(process.env.PORT) || 5000}`).replace(/\/$/, ""),
};
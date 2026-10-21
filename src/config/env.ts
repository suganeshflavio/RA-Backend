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
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "JWT_EXPIRES_IN",
  "PORT",
  "DIRECT_URL",
  "CDN_BASE_URL"
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
};

// import jwt from "jsonwebtoken";
// import { env } from "../config/env";

// export const generateToken = (
//   userId: string,
//   role: string,
//   sessionToken: string
// ) => {
//   return jwt.sign(
//     {
//       userId,
//       role,
//       sessionToken,
//     },
//     env.JWT_SECRET!,
//     {
//       expiresIn: env.JWT_EXPIRES_IN,
//     }
//   );
// };


import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface JwtPayload {
  userId: string;
  role: string;
  sessionToken: string | null;
}

export const generateToken = (payload: JwtPayload) => {
  return jwt.sign(payload, env.JWT_SECRET!, {
    expiresIn: env.JWT_EXPIRES_IN || "7d",
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET!) as JwtPayload;
};